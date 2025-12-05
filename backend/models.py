from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Column, JSON

class Candidate(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    resume_text: str  # Raw text from PDF
    skills: Optional[str] = None # JSON string or comma-separated
    experience_summary: Optional[str] = None
    projects: Optional[str] = None
    certifications: Optional[str] = None
    soft_skills: Optional[str] = None
    
    # Store embedding as JSON string for SQLite
    embedding: str = Field(default="[]")
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Job(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    requirements: Optional[str] = None
    
    embedding: str = Field(default="[]")
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

class JobCreate(SQLModel):
    title: str
    description: str
