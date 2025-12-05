import json
import re
from sentence_transformers import SentenceTransformer

# Load local embedding model (small and fast)
print("Loading local embedding model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model loaded.")

async def extract_resume_data(text: str) -> dict:
    """
    Heuristic/Regex based extraction since we don't have an LLM key.
    """
    data = {}
    
    # 1. Email
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    data["email"] = email_match.group(0) if email_match else None
    
    # 2. Phone
    phone_match = re.search(r'(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}', text)
    data["phone"] = phone_match.group(0) if phone_match else None
    
    # 3. Name (Skip headers like RESUME, CV, look for actual name patterns)
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    skip_words = ["resume", "cv", "curriculum vitae", "personal details", "contact", "profile", "summary"]
    
    name = "Unknown"
    for line in lines[:10]:  # Check first 10 lines
        line_lower = line.lower()
        # Skip lines that are just headers
        if any(skip in line_lower for skip in skip_words):
            continue
        # Skip lines that look like section headers (all caps or have colons)
        if line.isupper() and len(line) > 15:
            continue
        if ":" in line or "@" in line or "phone" in line_lower or "email" in line_lower:
            continue
        # Skip lines with URLs
        if "http" in line_lower or "www" in line_lower or ".com" in line_lower:
            continue
        # This might be a name - should be 2-4 words, mostly letters
        words = line.split()
        if 1 <= len(words) <= 5 and all(w.replace('.', '').replace(',', '').isalpha() for w in words):
            name = line.title()  # Capitalize properly
            break
    
    data["name"] = name
    
    # 4. Skills (Keyword matching against a common list)
    common_skills = ["python", "java", "react", "javascript", "typescript", "sql", "aws", "docker", "kubernetes", "html", "css", "node.js", "fastapi", "django", "flask", "c++", "go", "rust"]
    found_skills = []
    lower_text = text.lower()
    for skill in common_skills:
        if skill in lower_text:
            found_skills.append(skill)
    data["skills"] = found_skills
    
    # 5. Soft Skills
    soft_skills_list = ["leadership", "communication", "teamwork", "problem solving", "time management", "adaptability", "project management", "agile", "scrum", "collaboration"]
    found_soft_skills = []
    for skill in soft_skills_list:
        if skill in lower_text:
            found_soft_skills.append(skill)
    data["soft_skills"] = found_soft_skills

    # 6. Robust Section Extraction with Synonyms
    # We look for any of the keywords and take the next few lines
    def extract_section(keywords, max_lines=15):
        try:
            start_idx = -1
            # Try to find the first occurrence of ANY keyword
            for kw in keywords:
                idx = lower_text.find(kw)
                if idx != -1:
                    # If we found a keyword, check if it's likely a header (e.g., on its own line or followed by newline)
                    # This is a simple heuristic: take the first one found that looks promising
                    start_idx = idx
                    break
            
            if start_idx == -1: return None
            
            # Find the "visual" start in original text
            orig_start = start_idx
            # Extract next N lines
            lines = text[orig_start:].split('\n')[1:max_lines+1]
            return "\n".join(lines).strip()
        except:
            return None

    # Define Synonyms
    project_keywords = ["projects", "personal projects", "academic projects", "portfolio", "key projects"]
    cert_keywords = ["certifications", "courses", "licenses", "credentials", "training", "achievements", "certificates"]
    exp_keywords = ["experience", "employment", "work history", "professional background", "work experience"]
    
    data["projects"] = extract_section(project_keywords)
    data["certifications"] = extract_section(cert_keywords)
    
    # 7. Experience Summary (Try to extract actual section first, fallback to first 800 chars)
    extracted_exp = extract_section(exp_keywords, max_lines=20)
    if extracted_exp:
        data["experience_summary"] = extracted_exp.replace("\n", " ") + "..."
    else:
        data["experience_summary"] = text[:800].replace("\n", " ") + "..."
    
    return data

async def get_embedding(text: str) -> list[float]:
    """
    Generate embeddings locally using SentenceTransformers.
    """
    try:
        # model.encode returns a numpy array, convert to list
        embedding = model.encode(text).tolist()
        return embedding
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return []

async def rank_candidates(job_description: str, candidates: list) -> list:
    """
    Rank candidates based on cosine similarity of their embeddings.
    Since we don't have an LLM for reasoning, we'll generate a generic one.
    """
    # candidates is a list of dicts: {"id": 1, "text": "...", "embedding": [...]}
    # Note: In the main.py, we need to pass the actual embedding list, not just text.
    
    from sklearn.metrics.pairwise import cosine_similarity
    import numpy as np
    
    if not candidates:
        return []

    # Generate JD embedding
    jd_embedding = await get_embedding(job_description)
    
    # Extract key terms from JD for boosting (Naive approach)
    # We look for "management", "lead", "certification" in JD
    jd_lower = job_description.lower()
    boost_terms = ["management", "lead", "certified", "pmp", "agile", "scrum", "master", "phd"]
    active_boost_terms = [term for term in boost_terms if term in jd_lower]
    
    ranked_results = []
    
    for cand in candidates:
        cand_embedding = cand.get("embedding")
        if not cand_embedding:
            continue
            
        # 1. Semantic Score (Cosine Similarity)
        score = cosine_similarity([jd_embedding], [cand_embedding])[0][0]
        score_percent = score * 100
        
        # 2. Keyword Boost
        # If JD has "management" and Candidate has it, give +5 boost
        boost_score = 0
        cand_text_lower = cand.get("text", "").lower()
        matched_terms = []
        for term in active_boost_terms:
            if term in cand_text_lower:
                boost_score += 5
                matched_terms.append(term)
        
        final_score = min(100, score_percent + boost_score)
        final_score = round(final_score, 2)
        
        reasoning = f"Semantic Match: {round(score_percent, 1)}%."
        if matched_terms:
            reasoning += f" Boosted for: {', '.join(matched_terms)}."
        
        ranked_results.append({
            "candidate_id": cand['id'],
            "score": final_score,
            "reasoning": reasoning
        })
            
    # Sort by score
    ranked_results.sort(key=lambda x: x['score'], reverse=True)
    return ranked_results
