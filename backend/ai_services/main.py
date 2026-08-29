from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel
import shutil
import os

from rag.chatbot import ask_question
from rag.documents_ai import analyze_document
from rag.document_compare import compare_pdf_with_application


app = FastAPI(title="SIH AI Services")


class Question(BaseModel):
    question: str


@app.get("/")
def home():
    return {
        "message": "SIH AI Services is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/ask")
def ask(request: Question):

    result = ask_question(request.question)

    return result


@app.post("/document/analyze")
async def analyze_pdf(
    file: UploadFile = File(...)
):

    upload_folder = "rag/documents"

    os.makedirs(
        upload_folder,
        exist_ok=True
    )

    file_path = os.path.join(
        upload_folder,
        file.filename
    )

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    result = analyze_document(file_path)

    return result


@app.post("/document/compare")
async def compare_pdf(
    file: UploadFile = File(...),
    company: str = Form(...),
    approval: str = Form(...),
    issue_date: str = Form(...),
    expiry_date: str = Form(...)
):

    upload_folder = "rag/documents"

    os.makedirs(
        upload_folder,
        exist_ok=True
    )

    file_path = os.path.join(
        upload_folder,
        file.filename
    )

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    application_data = {
        "company": company,
        "approval": approval,
        "issue_date": issue_date,
        "expiry_date": expiry_date
    }

    result = compare_pdf_with_application(
        file_path,
        application_data
    )

    return result