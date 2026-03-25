# 🤖 AI Resume Analyzer

An intelligent resume analysis and job matching web application powered by **Groq AI (LLaMA 3.3)**.  
Upload your resume and get instant AI-powered feedback, skill analysis, and job match scores.

🔗 **Live Demo:** [https://ai-resume-analyzer-phi-lilac.vercel.app/](https://ai-resume-analyzer-phi-lilac.vercel.app/)

---

## ✨ Features

- 📄 **Resume Analysis** — Upload PDF or DOCX resume and get an overall score (0-100)
- 🧠 **AI-Powered Insights** — Extracts skills, experience, strengths, and weaknesses automatically
- 💡 **Smart Suggestions** — Get 5 personalized AI suggestions to improve your resume
- 🎯 **Job Matcher** — Paste any job description and get a match percentage
- 🔍 **Skill Gap Analysis** — See exactly which skills you have and which ones you're missing
- ⚡ **Instant Results** — Analysis completed in under 10 seconds
- 🔒 **Privacy First** — Resume is never stored on the server

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Axios | HTTP Requests |
| React Dropzone | File Upload |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| Groq SDK | AI API (LLaMA 3.3 70B) |
| Multer | File Upload Handling |
| pdf2json | PDF Text Extraction |
| Mammoth | DOCX Text Extraction |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend Hosting |
| Render | Backend Hosting |
| GitHub | Version Control |

---

## 📡 API Documentation

### Base URL
```
https://ai-resume-analyzer-oenr.onrender.com
```

### Endpoints

#### 1. Analyze Resume
```
POST /api/resume/analyze
```
**Request:** `multipart/form-data`
| Field | Type | Description |
|-------|------|-------------|
| resume | File | PDF or DOCX file (max 5MB) |

**Response:**
```json
{
  "success": true,
  "data": {
    "overallScore": 78,
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": "2 years",
    "strengths": ["Strong technical skills", "..."],
    "weaknesses": ["Missing certifications", "..."],
    "suggestions": ["Add quantifiable achievements", "..."],
    "summary": "A skilled developer with..."
  },
  "resumeText": "Extracted resume text..."
}
```

---

#### 2. Match Job Description
```
POST /api/resume/match
```
**Request:** `application/json`
| Field | Type | Description |
|-------|------|-------------|
| resumeText | String | Extracted resume text |
| jobDescription | String | Job description to match against |

**Response:**
```json
{
  "success": true,
  "data": {
    "matchScore": 85,
    "matchedSkills": ["JavaScript", "React"],
    "missingSkills": ["TypeScript", "AWS"],
    "suggestions": ["Learn TypeScript", "..."]
  }
}
```

---

## 🚀 Run Locally

### Prerequisites
- Node.js 18+
- Groq API Key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repository
```bash
git clone https://github.com/Abhi0833-eng/ai_resume_analyzer.git
cd ai_resume_analyzer
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file inside `/server`:
```
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
```

Start the backend:
```bash
node index.js
```

### 3. Setup Frontend
```bash
cd ../client
npm install
npm run dev
```

### 4. Open the app
```
http://localhost:5173
```

---

## 📁 Project Structure

```
ai-resume-analyzer/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── JobMatcher.jsx
│   │   │   └── JobMatchResults.jsx
│   │   └── App.jsx
│   └── package.json
│
└── server/                 # Node.js Backend
    ├── controllers/
    │   └── resumeController.js
    ├── routes/
    │   └── resume.js
    ├── index.js
    └── package.json
```

---

## 👨‍💻 Author

**Abhishek** — [GitHub](https://github.com/Abhi0833-eng)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
