const fs = require('fs');
const mammoth = require('mammoth');
const PDFParser = require('pdf2json');
const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Extract text from PDF
function extractPdfText(filePath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on('pdfParser_dataError', err => reject(err));
    pdfParser.on('pdfParser_dataReady', () => {
      const text = pdfParser.getRawTextContent();
      resolve(text);
    });
    pdfParser.loadPDF(filePath);
  });
}

// Extract text from uploaded file
async function extractText(file) {
  if (file.mimetype === 'application/pdf') {
    return await extractPdfText(file.path);
  } else {
    const result = await mammoth.extractRawText({ path: file.path });
    return result.value;
  }
}

// Analyze resume
exports.analyzeResume = async (req, res) => {
  try {
    const text = await extractText(req.file);
    fs.unlinkSync(req.file.path);

    const prompt = `You are a professional resume reviewer. Analyze this resume and return a JSON object with exactly these fields:
    - overallScore (number 0-100)
    - skills (array of strings, extract ALL technical skills, programming languages, frameworks, tools, soft skills, and domain knowledge mentioned ANYWHERE in the resume including projects, experience, and skills sections. Be thorough and extract every single skill mentioned.)
    - experience (string, look at actual work experience or internships in resume. If no experience found write "Fresher". If internship found write "Fresher (Internship Experience)". Only write years if actual full-time job experience exists.)
    - strengths (array of 3 strings)
    - weaknesses (array of 3 strings)
    - suggestions (array of 5 strings)
    - summary (string, 2 sentences)

    Resume text: ${text}

    Return ONLY valid JSON. No markdown, no backticks, just pure JSON.`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    });

    const rawText = response.choices[0].message.content;
    const parsed = JSON.parse(rawText);
    res.json({ success: true, data: parsed, resumeText: text });

  } catch (err) {
    console.error('ERROR:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Match resume with job description
exports.matchJob = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    const prompt = `Compare this resume against the job description and return a JSON object with exactly these fields:
    - matchScore (number 0-100)
    - matchedSkills (array of strings)
    - missingSkills (array of strings)
    - suggestions (array of 5 strings)

    Resume: ${resumeText}
    Job Description: ${jobDescription}

    Return ONLY valid JSON. No markdown, no backticks, just pure JSON.`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
    });

    const rawText = response.choices[0].message.content;
    const parsed = JSON.parse(rawText);
    res.json({ success: true, data: parsed });

  } catch (err) {
    console.error('ERROR:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Chat with AI Career Assistant
exports.chat = async (req, res) => {
  try {
    const { message, resumeContext, history } = req.body;

    const systemPrompt = `You are an expert AI Career Assistant called ResumeRadar Assistant. 
    You help people improve their resumes, find jobs, and give career advice.
    You are friendly, professional, and give specific actionable advice.
    Keep responses concise and helpful (max 3-4 sentences).
    
    Current user's resume context:
    ${resumeContext}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user', content: message }
    ];

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;
    res.json({ success: true, reply });

  } catch (err) {
    console.error('Chat ERROR:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

  