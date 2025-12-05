# HireX - AI-Powered Hiring Platform

An intelligent recruitment platform that uses AI to match candidates with job descriptions, analyze resumes, and streamline the hiring process.

## 🚀 Features

- **AI-Powered Candidate Matching**: Semantic search using embeddings to match candidates with job descriptions
- **Resume Parsing**: Automatic extraction of skills, experience, and qualifications from PDF/DOCX resumes
- **Bulk Upload**: Upload multiple resumes at once
- **Smart Ranking**: AI-driven candidate ranking based on job requirements
- **Google Authentication**: Secure login with Google OAuth
- **Guest Mode**: Quick access for testing without authentication
- **Modern UI**: Beautiful, responsive interface with dark mode support

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+** and npm
- **Google API Key** (Gemini API for AI features)
- **Google OAuth Client ID** (for authentication)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd HireX
```

### 2. Backend Setup

#### Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./hirex.db
```

**Getting your Google API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste it into the `.env` file

### 3. Frontend Setup

#### Install Node Dependencies

```bash
cd ../frontend
npm install
```

#### Configure Google OAuth (Optional)

If you want to use Google authentication instead of guest mode:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:8080` to authorized JavaScript origins
6. Update `frontend/src/main.tsx` with your Client ID

## 🚀 Running the Application

### Start Backend Server

From the project root directory:

```bash
# Windows PowerShell
$env:PYTHONPATH='<full-path-to-HireX-folder>'; uvicorn backend.main:app --reload --host 0.0.0.0 --port 8002

# Linux/Mac
PYTHONPATH=<full-path-to-HireX-folder> uvicorn backend.main:app --reload --host 0.0.0.0 --port 8002
```

The backend will be available at: `http://localhost:8002`

### Start Frontend Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available at: `http://localhost:8080`

## 📖 Usage

1. **Access the Application**: Open `http://localhost:8080` in your browser
2. **Login**: Use Google Sign-In or "Continue as Guest"
3. **Upload Resumes**: Go to Candidates page and upload PDF/DOCX resumes
4. **Create Job Description**: Navigate to "Create JD" and define your requirements
5. **View Ranked Candidates**: See AI-matched candidates sorted by relevance
6. **Manage Candidates**: Delete individual candidates or clear all

## 🗂️ Project Structure

```
HireX/
├── backend/
│   ├── main.py              # FastAPI application & endpoints
│   ├── models.py            # Database models
│   ├── database.py          # Database configuration
│   ├── services/
│   │   ├── parser.py        # Resume parsing logic
│   │   └── llm.py           # AI/LLM integration
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API integration
│   │   └── contexts/        # React contexts
│   ├── package.json         # Node dependencies
│   └── vite.config.ts       # Vite configuration
│
└── README.md
```

## 🔧 API Endpoints

### Candidates
- `POST /api/v1/upload` - Upload resumes (bulk)
- `GET /api/v1/candidates` - Get all candidates
- `DELETE /api/v1/candidates/{id}` - Delete a candidate
- `DELETE /api/v1/candidates` - Delete all candidates

### Jobs
- `POST /api/v1/jobs` - Create a job description
- `GET /api/v1/jobs/{job_id}/candidates` - Get ranked candidates for a job

### Utilities
- `POST /api/v1/seed` - Seed database with sample candidates
- `POST /api/v1/candidates/regenerate-embeddings` - Regenerate embeddings

## 🧪 Testing

The application comes pre-seeded with 5 sample candidates on startup. You can:
- Upload your own resumes (PDF/DOCX)
- Create custom job descriptions
- Test the ranking algorithm

## 🐛 Troubleshooting

### Backend Issues

**ModuleNotFoundError: No module named 'backend'**
- Make sure you're running from the project root
- Set PYTHONPATH correctly to the HireX folder

**API Key Error**
- Verify your Google API key in `.env`
- Check API key has Gemini API enabled

### Frontend Issues

**Port 8080 already in use**
- Change port in `vite.config.ts`
- Or kill the process using port 8080

**Google OAuth not working**
- Verify Client ID is correct
- Check authorized origins include `http://localhost:8080`

## 🔐 Security Notes

- Never commit `.env` files with real API keys
- Use environment variables for sensitive data
- For production, use proper authentication and HTTPS

## 📝 Technologies Used

### Backend
- FastAPI - Modern Python web framework
- SQLModel - SQL database ORM
- Sentence Transformers - Semantic embeddings
- Google Gemini API - AI/LLM capabilities
- PDFPlumber & python-docx - Document parsing

### Frontend
- React + TypeScript
- Vite - Build tool
- TailwindCSS - Styling
- Framer Motion - Animations
- Radix UI - Component primitives
- React Router - Navigation

## 📄 License

This project is for educational/hackathon purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Made with ❤️ for RV Hack**
