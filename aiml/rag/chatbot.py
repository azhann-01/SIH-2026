import json
import math
import ollama


VECTOR_FILE = "rag/vectors.json"
MODEL = "gemma3:1b"
EMBED_MODEL = "nomic-embed-text"


def cosine_similarity(a, b):
    dot_product = sum(x * y for x, y in zip(a, b))

    magnitude_a = math.sqrt(sum(x * x for x in a))
    magnitude_b = math.sqrt(sum(x * x for x in b))

    if magnitude_a == 0 or magnitude_b == 0:
        return 0

    return dot_product / (magnitude_a * magnitude_b)


def load_vectors():
    with open(VECTOR_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def search_documents(question, vectors, top_k=2):

    response = ollama.embed(
        model=EMBED_MODEL,
        input=question
    )

    question_embedding = response["embeddings"][0]

    results = []

    for item in vectors:
        similarity = cosine_similarity(
            question_embedding,
            item["embedding"]
        )

        results.append({
            "text": item["text"],
            "filename": item["filename"],
            "similarity": similarity
        })

    results.sort(
        key=lambda x: x["similarity"],
        reverse=True
    )

    return results[:top_k]


def generate_answer(question, context):

    prompt = f"""
You are an AI assistant for a document-based question answering system.

Answer the user's question using the provided context.

If the answer is not available in the context, say:
"I could not find this information in the provided documents."

Do not make up information.

Context:
{context}

Question:
{question}

Answer:
"""

    response = ollama.chat(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"]


def ask_question(question):

    vectors = load_vectors()

    results = search_documents(question, vectors, top_k=3)

    context = "\n\n".join(
        result["text"]
        for result in results
    )

    answer = generate_answer(
        question,
        context
    )

    return {
        "question": question,
        "answer": answer,
        "sources": [
            result["filename"]
            for result in results
        ],
    "relevant_documents": len(results)
}



if __name__ == "__main__":

    question = input("Ask a question: ")

    result = ask_question(question)

    print("\nAnswer:")
    print(result["answer"])

    print("\nSources:")
    for source in result["sources"]:
        print("-", source)