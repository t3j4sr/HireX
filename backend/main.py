from fastapi import FastAPI, UploadFile, File, HTTPException
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from backend.services.parser import parse_resume
from backend.services.llm import extract_resume_data, get_embedding, rank_candidates
from backend.database import get_session, init_db
from backend.models import Candidate, Job, JobCreate
from sqlmodel import Session, select
from fastapi import Depends, Body, Form
import json

app = FastAPI(title="HireX API", version="1.0.0")

# CORS Setup (Allowing all for development, restrict in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def seed_fake_data(session: Session):
    candidates = session.exec(select(Candidate)).all()
    if not candidates:
        print("Seeding fake candidates...")
        fake_candidates = [
            Candidate(
                name="Alice Johnson",
                email="alice@example.com",
                phone="123-456-7890",
                resume_text="Experienced Software Engineer with a focus on full-stack development. Proficient in Python, React, and cloud technologies.",
                skills=json.dumps(["Python", "React", "FastAPI", "Docker", "AWS"]),
                soft_skills=json.dumps(["Leadership", "Problem Solving"]),
                experience_summary="5 years as a Senior Software Engineer at Tech Corp. Led a team of 4 developers.",
                projects="Built a scalable e-commerce platform.",
                certifications="AWS Certified Solutions Architect",
                embedding=json.dumps([]) # Mock embedding
            ),
            Candidate(
                name="Bob Smith",
                email="bob@example.com",
                phone="987-654-3210",
                resume_text="Business Analyst with strong data analysis skills. Expert in SQL, Tableau, and financial modeling.",
                skills=json.dumps(["SQL", "Tableau", "Excel", "Data Analysis"]),
                soft_skills=json.dumps(["Communication", "Strategic Thinking"]),
                experience_summary="3 years as a Business Analyst at Finance Inc. Improved reporting efficiency by 40%.",
                projects="Financial forecasting dashboard.",
                certifications="Google Data Analytics Professional Certificate",
                embedding=json.dumps([])
            ),
            Candidate(
                name="Dr. Carol Williams",
                email="carol@example.com",
                phone="555-123-4567",
                resume_text="Board-certified Cardiologist with 10 years of clinical experience. Dedicated to patient care and medical research.",
                skills=json.dumps(["Cardiology", "Patient Care", "Surgery", "Medical Research"]),
                soft_skills=json.dumps(["Empathy", "Decision Making"]),
                experience_summary="Cardiologist at City Hospital. Conducted over 500 successful procedures.",
                projects="Research on heart disease prevention.",
                certifications="Board Certified in Cardiology",
                embedding=json.dumps([])
            )
        ]
        for c in fake_candidates:
            session.add(c)
        session.commit()
        print("Seeding complete.")
    else:
        print("Database already has candidates. Skipping seed.")

@app.on_event("startup")
def on_startup():
    init_db()
    
    # Seed fake data if empty
    with Session(get_session().__next__().bind) as session:
        seed_fake_data(session)

@app.post("/api/v1/seed")
async def seed_db_endpoint(session: Session = Depends(get_session)):
    seed_fake_data(session)
    return {"message": "Database seeded (if empty)"}

@app.get("/")
def read_root():
    return {"message": "HireX Backend is running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/v1/upload")
async def upload_resume(files: List[UploadFile] = File(...), session: Session = Depends(get_session)):
    results = []
    
    for file in files:
        try:
            text = await parse_resume(file)
            if not text:
                results.append({"filename": file.filename, "status": "error", "detail": "Could not extract text"})
                continue
            
            extracted_data = await extract_resume_data(text)
            
            # Generate embedding from a Rich Profile
            embedding_text = f"""
            Name: {extracted_data.get('name')}
            Skills: {', '.join(extracted_data.get('skills', []))}
            Soft Skills: {', '.join(extracted_data.get('soft_skills', []))}
            Experience: {extracted_data.get('experience_summary', '')}
            Projects: {extracted_data.get('projects', '')}
            Certifications: {extracted_data.get('certifications', '')}
            """
            embedding = await get_embedding(embedding_text)
            
            candidate = Candidate(
                name=extracted_data.get("name", "Unknown"),
                email=extracted_data.get("email"),
                phone=extracted_data.get("phone"),
                resume_text=text,
                skills=json.dumps(extracted_data.get("skills", [])),
                soft_skills=json.dumps(extracted_data.get("soft_skills", [])),
                projects=extracted_data.get("projects"),
                certifications=extracted_data.get("certifications"),
                experience_summary=extracted_data.get("experience_summary"),
                embedding=json.dumps(embedding)
            )
            
            session.add(candidate)
            session.commit()
            session.refresh(candidate)
            
            results.append({
                "filename": file.filename, 
                "status": "success", 
                "candidate_id": candidate.id, 
                "parsed_data": extracted_data
            })
            
        except Exception as e:
            print(f"Error processing {file.filename}: {e}")
            results.append({"filename": file.filename, "status": "error", "detail": str(e)})
    
    return results

@app.delete("/api/v1/candidates/{candidate_id}")
async def delete_candidate(candidate_id: int, session: Session = Depends(get_session)):
    candidate = session.get(Candidate, candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    session.delete(candidate)
    session.commit()
    return {"message": "Candidate deleted"}

@app.delete("/api/v1/candidates")
async def delete_all_candidates(session: Session = Depends(get_session)):
    statement = select(Candidate)
    results = session.exec(statement).all()
    for candidate in results:
        session.delete(candidate)
    session.commit()
    return {"message": "All candidates deleted"}

@app.post("/api/v1/jobs")
async def create_job(
    title: str = Form(...), 
    description: str = Form(...), 
    session: Session = Depends(get_session)
):
    # Using Form(...) allows sending multi-line text easily without JSON escaping issues
    embedding = await get_embedding(description)
    
    job = Job(
        title=title,
        description=description,
        embedding=json.dumps(embedding)
    )
    
    session.add(job)
    session.commit()
    session.refresh(job)
    
    return {"job_id": job.id}

@app.get("/api/v1/candidates")
async def get_candidates(session: Session = Depends(get_session)):
    candidates = session.exec(select(Candidate)).all()
    return candidates

@app.get("/api/v1/jobs/{job_id}/candidates")
async def get_ranked_candidates(job_id: int, session: Session = Depends(get_session)):
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # 1. Fetch all candidates (SQLite doesn't do vector search efficiently, so we do in-memory)
    statement = select(Candidate)
    results = session.exec(statement).all()
    
    # 2. Rank in-memory
    candidates_for_ranking = []
    for c in results:
        try:
            emb = json.loads(c.embedding)
            candidates_for_ranking.append({
                "id": c.id,
                "text": c.resume_text, # Pass full text for keyword boosting
                "embedding": emb
            })
        except:
            continue
    
    ranked_data = await rank_candidates(job.description, candidates_for_ranking)
    
    # Merge results
    final_response = []
    for rank in ranked_data:
        cand = next((c for c in results if c.id == rank['candidate_id']), None)
        if cand:
            final_response.append({
                "candidate": cand,
                "match_score": rank["score"],
                "reasoning": rank["reasoning"]
            })
            
    return final_response
