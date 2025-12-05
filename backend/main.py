from fastapi import FastAPI, UploadFile, File, HTTPException
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from backend.services.parser import parse_resume
from backend.services.llm import extract_resume_data, get_embedding, rank_candidates
from backend.database import get_session, init_db, engine, engine
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

async def seed_fake_data(session: Session):
    candidates = session.exec(select(Candidate)).all()
    
    # First, fix any existing candidates with empty embeddings
    for candidate in candidates:
        try:
            emb = json.loads(candidate.embedding)
            if not emb or not isinstance(emb, list) or len(emb) == 0:
                # Regenerate embedding for existing candidate
                embedding_text = f"""
                Name: {candidate.name}
                Skills: {candidate.skills or 'N/A'}
                Soft Skills: {candidate.soft_skills or 'N/A'}
                Experience: {candidate.experience_summary or 'N/A'}
                Projects: {candidate.projects or 'N/A'}
                Certifications: {candidate.certifications or 'N/A'}
                """
                embedding = await get_embedding(embedding_text)
                candidate.embedding = json.dumps(embedding)
        except:
            # If parsing fails, regenerate
            embedding_text = f"""
            Name: {candidate.name}
            Skills: {candidate.skills or 'N/A'}
            Soft Skills: {candidate.soft_skills or 'N/A'}
            Experience: {candidate.experience_summary or 'N/A'}
            Projects: {candidate.projects or 'N/A'}
            Certifications: {candidate.certifications or 'N/A'}
            """
            embedding = await get_embedding(embedding_text)
            candidate.embedding = json.dumps(embedding)
    
    # Always ensure the 5 dummy candidates exist
    print("Ensuring dummy candidates exist...")
    fake_candidates_data = [
        {
            "name": "Alice Johnson",
            "email": "alice@example.com",
            "phone": "123-456-7890",
            "resume_text": "Experienced Software Engineer with a focus on full-stack development. Proficient in Python, React, and cloud technologies.",
            "skills": ["Python", "React", "FastAPI", "Docker", "AWS"],
            "soft_skills": ["Leadership", "Problem Solving"],
            "experience_summary": "5 years as a Senior Software Engineer at Tech Corp. Led a team of 4 developers.",
            "projects": "Built a scalable e-commerce platform.",
            "certifications": "AWS Certified Solutions Architect"
        },
        {
            "name": "Bob Smith",
            "email": "bob@example.com",
            "phone": "987-654-3210",
            "resume_text": "Business Analyst with strong data analysis skills. Expert in SQL, Tableau, and financial modeling.",
            "skills": ["SQL", "Tableau", "Excel", "Data Analysis"],
            "soft_skills": ["Communication", "Strategic Thinking"],
            "experience_summary": "3 years as a Business Analyst at Finance Inc. Improved reporting efficiency by 40%.",
            "projects": "Financial forecasting dashboard.",
            "certifications": "Google Data Analytics Professional Certificate"
        },
        {
            "name": "David Kim",
            "email": "david@example.com",
            "phone": "555-987-6543",
            "resume_text": "Full-stack developer specializing in React and Node.js. Strong background in fintech applications and security.",
            "skills": ["React", "Node.js", "TypeScript", "PostgreSQL", "Security"],
            "soft_skills": ["Team Collaboration", "Agile"],
            "experience_summary": "4 years developing secure financial applications. Expert in React and backend APIs.",
            "projects": "Payment processing system with fraud detection.",
            "certifications": "Certified Secure Software Developer"
        },
        {
            "name": "Emma Rodriguez",
            "email": "emma@example.com",
            "phone": "555-234-5678",
            "resume_text": "Data Scientist with expertise in machine learning and statistical analysis. Proficient in Python, TensorFlow, and data visualization.",
            "skills": ["Python", "Machine Learning", "TensorFlow", "Pandas", "Data Visualization"],
            "soft_skills": ["Analytical Thinking", "Research"],
            "experience_summary": "5 years in data science roles. Built predictive models for business intelligence.",
            "projects": "Customer churn prediction model with 85% accuracy.",
            "certifications": "Google Machine Learning Engineer Certificate"
        },
        {
            "name": "Michael Chen",
            "email": "michael@example.com",
            "phone": "555-345-6789",
            "resume_text": "DevOps Engineer with extensive experience in cloud infrastructure, CI/CD pipelines, and container orchestration.",
            "skills": ["Kubernetes", "Docker", "AWS", "Terraform", "Jenkins"],
            "soft_skills": ["Problem Solving", "Automation"],
            "experience_summary": "6 years managing cloud infrastructure. Reduced deployment time by 70%.",
            "projects": "Multi-cloud infrastructure automation platform.",
            "certifications": "AWS Certified DevOps Engineer"
        }
    ]
    
    # Check which dummy candidates already exist (by email)
    existing_emails = {c.email for c in candidates if c.email}
    added_count = 0
    
    for data in fake_candidates_data:
        # Only add if this email doesn't exist
        if data["email"] not in existing_emails:
            # Generate embedding from rich profile (same format as upload endpoint)
            embedding_text = f"""
            Name: {data['name']}
            Skills: {', '.join(data['skills'])}
            Soft Skills: {', '.join(data['soft_skills'])}
            Experience: {data['experience_summary']}
            Projects: {data['projects']}
            Certifications: {data['certifications']}
            """
            embedding = await get_embedding(embedding_text)
            
            candidate = Candidate(
                name=data["name"],
                email=data["email"],
                phone=data["phone"],
                resume_text=data["resume_text"],
                skills=json.dumps(data["skills"]),
                soft_skills=json.dumps(data["soft_skills"]),
                experience_summary=data["experience_summary"],
                projects=data["projects"],
                certifications=data["certifications"],
                embedding=json.dumps(embedding)
            )
            session.add(candidate)
            added_count += 1
    
    session.commit()
    if added_count > 0:
        print(f"Added {added_count} new dummy candidates. Total candidates: {len(candidates) + added_count}")
    else:
        print(f"All 5 dummy candidates already exist. Total candidates: {len(candidates)}")

@app.on_event("startup")
async def on_startup():
    try:
        init_db()
        print("Database initialized.")
        
        # Seed fake data if empty
        with Session(engine) as session:
            await seed_fake_data(session)
        print("Startup complete.")
    except Exception as e:
        print(f"Error during startup: {e}")
        import traceback
        traceback.print_exc()

@app.post("/api/v1/seed")
async def seed_db_endpoint(session: Session = Depends(get_session)):
    await seed_fake_data(session)
    candidates = session.exec(select(Candidate)).all()
    return {"message": f"Database seeded. Total candidates: {len(candidates)}"}

@app.post("/api/v1/candidates/regenerate-embeddings")
async def regenerate_embeddings(session: Session = Depends(get_session)):
    """Regenerate embeddings for candidates that have empty or invalid embeddings."""
    candidates = session.exec(select(Candidate)).all()
    updated_count = 0
    
    for candidate in candidates:
        try:
            emb = json.loads(candidate.embedding)
            # Check if embedding is empty or invalid
            if not emb or not isinstance(emb, list) or len(emb) == 0:
                # Generate embedding from rich profile
                embedding_text = f"""
                Name: {candidate.name}
                Skills: {candidate.skills or 'N/A'}
                Soft Skills: {candidate.soft_skills or 'N/A'}
                Experience: {candidate.experience_summary or 'N/A'}
                Projects: {candidate.projects or 'N/A'}
                Certifications: {candidate.certifications or 'N/A'}
                """
                embedding = await get_embedding(embedding_text)
                candidate.embedding = json.dumps(embedding)
                updated_count += 1
        except:
            # If parsing fails, regenerate
            embedding_text = f"""
            Name: {candidate.name}
            Skills: {candidate.skills or 'N/A'}
            Soft Skills: {candidate.soft_skills or 'N/A'}
            Experience: {candidate.experience_summary or 'N/A'}
            Projects: {candidate.projects or 'N/A'}
            Certifications: {candidate.certifications or 'N/A'}
            """
            embedding = await get_embedding(embedding_text)
            candidate.embedding = json.dumps(embedding)
            updated_count += 1
    
    session.commit()
    return {"message": f"Regenerated embeddings for {updated_count} candidates"}

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
            import traceback
            traceback.print_exc()
            results.append({"filename": file.filename, "status": "error", "detail": str(e)})
    
    # If all files failed, raise an error
    if all(r.get("status") == "error" for r in results):
        raise HTTPException(status_code=400, detail=f"Failed to process all files: {results}")
    
    return results

@app.delete("/api/v1/candidates/{candidate_id}")
async def delete_candidate(candidate_id: int, session: Session = Depends(get_session)):
    try:
        candidate = session.get(Candidate, candidate_id)
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")
        session.delete(candidate)
        session.commit()
        return {"message": "Candidate deleted successfully", "candidate_id": candidate_id}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting candidate {candidate_id}: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error deleting candidate: {str(e)}")

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
            # Skip if embedding is empty or invalid
            if not emb or not isinstance(emb, list) or len(emb) == 0:
                continue
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
