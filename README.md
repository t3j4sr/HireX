HireX

An AI-powered hiring engine that semantically understands job descriptions, parses resumes, and ranks candidates using embeddings, cosine similarity, and AI-generated rationales.

 Overview

Hiring today is slow, manual, and inefficient. Recruiters manually screen hundreds of resumes across multiple platforms like LinkedIn, Naukri, and job boards—resulting in missed talent, bias, and slow hiring cycles.

This platform replaces that broken process with an intelligent, AI-driven recommendation engine that:

Extracts skills, roles, seniority, and context from job descriptions

Parses resumes automatically

Converts everything into embeddings

Computes candidate fit using cosine similarity

Generates human-readable justifications

Outputs a ranked candidate list

 Problem Statement

HR teams spend hours shortlisting candidates using keyword filters that fail to capture true skills or experience.
Current systems cannot:

Understand job descriptions semantically

Measure real competence

Compare resumes contextually

Reduce manual workload

Remove bias

This platform solves all of these.
  
Solution

 Job Description Understanding

AI extracts required skills, responsibilities, hidden expectations, seniority level.

 Resume Parsing

Extracts experience, skills, achievements from PDFs/DOCX files.

 Embedding-Based Semantic Matching

Both JD and resumes are converted into vector embeddings.

 Matching Engine

Uses cosine similarity to compute:

Overall match score (0–100)

Skill alignment

Experience relevance

AI Justification

Gemini/LLM generates human-readable reasoning for why a candidate is a good fit.

 Ranked Output

Recruiters receive a structured list of the best candidates.

 Workflow
1. Recruiter Uploads Job Description

System understands role context, skills, domain, seniority.

2. Recruiter Uploads Resumes

AI extracts clean text and identifies skills, experience, and signals of role fit.

3. Embedding Generation

JD and resume text → vector embeddings for semantic comparison.

4. Candidate Matching

Cosine similarity is computed between job embedding and each resume embedding.

5. AI Explanation

AI summarizes why each candidate fits:

Relevant experience

Skill matches

Strengths

Missing skills

6. Ranked Candidate List

Sorted from highest to lowest fit.

7. Recruiter Finalizes Shortlist

System improves over time by learning from selections.

 Why We’re Building This

Recruitment is slow, chaotic, and inconsistent.
We’re solving:

Wasted screening hours

Missed high-quality candidates

Keyword-based inaccuracies

Human bias

Unscalable manual filtering

This platform makes hiring 10× faster, smarter, and more accurate.

 Features

Job description parsing

AI-based resume extraction

Embedding-based semantic search

Cosine similarity scoring

Candidate ranking

AI-generated rationale

Recruiter dashboard

 Tech Stack

Category	Technology
Frontend	React.js / Next.js
Backend	Node.js / Express OR Python FastAPI
AI/NLP	Sentence-BERT, Gemini Embeddings, spaCy
Vector DB	FAISS / Pinecone
Database	MongoDB / PostgreSQL
Deployment	Vercel / Render / Railway


 Architecture

 HR Uploads JD
        ↓
NLP Processing → JD Embedding
        ↓
HR Uploads Resumes
        ↓
Resume Parser → Resume Embeddings
        ↓
Cosine Similarity Matching Engine
        ↓
AI Justification Generator
        ↓
Ranked Candidate Output

 Folder Structure
root/
 ├── backend/
 │     ├── controllers/
 │     ├── models/
 │     ├── utils/
 │     ├── routes/
 │     └── server.js
 ├── frontend/
 │     ├── components/
 │     ├── pages/
 │     └── App.js
 ├── ml/
 │     ├── jd_embedding.py
 │     └── resume_parser.py
 └── README.md

 How to Run
Backend
cd backend
npm install
npm start

Frontend
cd frontend
npm install
npm run dev
SSS
