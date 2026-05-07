import os
import json

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def analyze_resume(resume_text: str, job_description: str) -> dict:

    prompt = f"""
Você é um especialista em recrutamento, ATS, currículo e carreira em tecnologia.

Analise o currículo abaixo em relação à vaga informada.

CURRÍCULO:
{resume_text}

VAGA:
{job_description}

Retorne APENAS um JSON válido, sem markdown, sem explicações extras, neste formato:

{{
  "score": 85,
  "strengths": ["ponto forte 1", "ponto forte 2"],
  "weaknesses": ["lacuna 1", "lacuna 2"],
  "improvements": ["melhoria 1", "melhoria 2"],
  "improved_summary": "resumo profissional melhorado",
  "cover_letter": "carta curta de candidatura",
  "recommended_roles": ["cargo 1", "cargo 2"]
}}
"""

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt,
    )

    content = response.output_text

    return json.loads(content)


def generate_optimized_resume(
    resume_text: str,
    job_description: str
) -> dict:

    prompt = f"""
Você é um especialista em recrutamento, ATS e currículos.

Reescreva e otimize completamente o currículo abaixo
para aumentar as chances do candidato ser aprovado
na vaga informada.

Use linguagem profissional, moderna e otimizada para ATS.

CURRÍCULO ORIGINAL:
{resume_text}

VAGA:
{job_description}

Retorne APENAS um JSON válido neste formato:

{{
   "optimized_resume": "currículo otimizado completo aqui"
}}
"""

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt,
    )

    content = response.output_text

    return json.loads(content)