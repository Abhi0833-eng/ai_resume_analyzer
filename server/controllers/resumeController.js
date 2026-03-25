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
    - skills (array of strings)
    - experience (string, e.g. "3 years")
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