from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from backend.app.schemas import (
    AnalyzeRequest,
    AnalyzeResponse,
    GenerateResumeResponse
)

from backend.app.services.ai_service import (
    analyze_resume,
    generate_optimized_resume
)

from backend.app.services.pdf_service import extract_text_from_pdf

app = FastAPI(
    title="Smart Resume AI",
    description="API para análise inteligente de currículos com IA",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():

    return {
        "message": "Smart Resume AI API running"
    }


@app.get("/health")
def health():

    return {
        "status": "ok"
    }


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(data: AnalyzeRequest):

    result = analyze_resume(
        resume_text=data.resume_text,
        job_description=data.job_description,
    )

    return result


@app.post("/generate-resume", response_model=GenerateResumeResponse)
def generate_resume(data: AnalyzeRequest):

    result = generate_optimized_resume(
        resume_text=data.resume_text,
        job_description=data.job_description,
    )

    return result


@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    text = await extract_text_from_pdf(file)

    return {
        "filename": file.filename,
        "text": text
    }