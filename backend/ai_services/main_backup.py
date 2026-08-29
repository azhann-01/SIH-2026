from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import shutil
import os

from rag.chatbot import ask_question
from rag.documents_ai import analyze_document


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
async def analyze_pdf(file: UploadFile = File(...)):

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