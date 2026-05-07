from pydantic import BaseModel
from typing import List


class AnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str


class AnalyzeResponse(BaseModel):
    score: int
    strengths: List[str]
    weaknesses: List[str]
    improvements: List[str]
    improved_summary: str
    cover_letter: str
    recommended_roles: List[str]


class GenerateResumeResponse(BaseModel):
    optimized_resume: str