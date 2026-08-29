import os
import json
import ollama
from pypdf import PdfReader


DOCUMENT_FOLDER = "rag/documents"
OUTPUT_FILE = "rag/vectors.json"

EMBED_MODEL = "nomic-embed-text"


def read_documents():
    documents = []

    for filename in os.listdir(DOCUMENT_FOLDER):

        filepath = os.path.join(DOCUMENT_FOLDER, filename)

        # Read TXT files
        if filename.endswith(".txt"):

            with open(filepath, "r", encoding="utf-8") as file:
                text = file.read()

            documents.append({
                "filename": filename,
                "text": text
            })

        # Read PDF files
        elif filename.endswith(".pdf"):

            reader = PdfReader(filepath)

            text = ""

            for page in reader.pages:
                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

            documents.append({
                "filename": filename,
                "text": text
            })

    return documents


def create_chunks(text, chunk_size=500):

    words = text.split()

    chunks = []

    for i in range(0, len(words), chunk_size):

        chunk = " ".join(
            words[i:i + chunk_size]
        )

        chunks.append(chunk)

    return chunks


def main():

    documents = read_documents()

    vectors = []

    for document in documents:

        chunks = create_chunks(
            document["text"]
        )

        print(
            f"{document['filename']}: "
            f"{len(chunks)} chunks"
        )

        for chunk in chunks:

            print("Creating embedding...")

            response = ollama.embed(
                model=EMBED_MODEL,
                input=chunk
            )

            embedding = response["embeddings"][0]

            vectors.append({
                "filename": document["filename"],
                "text": chunk,
                "embedding": embedding
            })

    with open(
        OUTPUT_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            vectors,
            file
        )

    print()
    print("RAG ingestion completed!")
    print(f"Saved vectors to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()