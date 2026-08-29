import os
import re
from pypdf import PdfReader


DOCUMENTS_FOLDER = "rag/documents"


def extract_text_from_pdf(filepath):
    """Extract text from a PDF."""

    reader = PdfReader(filepath)

    pages = []

    for page in reader.pages:
        text = page.extract_text()

        if text:
            pages.append(text)

    return "\n".join(pages)


def find_field(text, patterns):
    """
    Find a field using multiple possible labels.

    Supports both:
    Label: Value

    and:

    Label
    Value
    """

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    for i, line in enumerate(lines):

        for pattern in patterns:

            match = re.search(
                pattern,
                line,
                re.IGNORECASE
            )

            if match:
                value = match.group(1).strip()

                if value:
                    return value

        # Check if label and value are on separate lines
        for pattern in patterns:

            label_pattern = pattern.split(
                r"\s*[:\-]\s*"
            )[0]

            if re.fullmatch(
                label_pattern,
                line,
                re.IGNORECASE
            ):

                if i + 1 < len(lines):
                    return lines[i + 1]

    return "UNKNOWN"


def extract_fields(text):
    """Extract important document fields."""

    fields = {}

    # Company
    fields["company"] = find_field(
        text,
        [
            r"Company\s*[:\-]\s*(.+)",
            r"Company Name\s*[:\-]\s*(.+)",
            r"Organization\s*[:\-]\s*(.+)"
        ]
    )

    # Approval
    fields["approval"] = find_field(
        text,
        [
            r"Approval\s*[:\-]\s*(.+)",
            r"Approval Type\s*[:\-]\s*(.+)",
            r"License Type\s*[:\-]\s*(.+)"
        ]
    )

    # Department
    fields["department"] = find_field(
        text,
        [
            r"Department\s*[:\-]\s*(.+)",
            r"Department Name\s*[:\-]\s*(.+)",
            r"Issuing Department\s*[:\-]\s*(.+)"
        ]
    )

    # Issue Date
    fields["issue_date"] = find_field(
        text,
        [
            r"Issue Date\s*[:\-]\s*(.+)",
            r"Date of Issue\s*[:\-]\s*(.+)",
            r"Issued On\s*[:\-]\s*(.+)"
        ]
    )

    # Expiry Date
    fields["expiry_date"] = find_field(
        text,
        [
            r"Expiry Date\s*[:\-]\s*(.+)",
            r"Expiration Date\s*[:\-]\s*(.+)",
            r"Valid Until\s*[:\-]\s*(.+)"
        ]
    )

    return fields


def detect_document_type(text):
    """Detect a basic document type."""

    text_lower = text.lower()

    if "certificate" in text_lower:
        return "Certificate"

    if "license" in text_lower:
        return "License"

    if "approval" in text_lower:
        return "Approval Document"

    if "application" in text_lower:
        return "Application Document"

    if "permit" in text_lower:
        return "Permit"

    if "test document" in text_lower:
        return "Test / Information Document"

    return "Unknown"


def analyze_document(filepath):
    """Analyze one PDF document."""

    if not os.path.exists(filepath):
        return {
            "error": "File not found",
            "filepath": filepath
        }

    reader = PdfReader(filepath)

    text = extract_text_from_pdf(filepath)

    fields = extract_fields(text)

    document_type = detect_document_type(text)

    filename = os.path.basename(filepath)

    result = {
        "filename": filename,
        "pages": len(reader.pages),
        "characters": len(text),
        "document_type": document_type,
        "fields": fields,
        "text": text
    }

    return result


def print_analysis(result):
    """Print analysis in a readable format."""

    print("\nDocument Analysis")
    print("-----------------")

    if "error" in result:
        print("Error:", result["error"])
        return

    print("File:", result["filename"])
    print("Pages:", result["pages"])
    print("Characters:", result["characters"])
    print("Document Type:", result["document_type"])

    print("\nExtracted Fields")
    print("----------------")

    for field, value in result["fields"].items():
        print(f"{field}: {value}")

    print("\nExtracted Text")
    print("--------------")
    print(result["text"])


def main():

    pdf_files = [
        file
        for file in os.listdir(DOCUMENTS_FOLDER)
        if file.lower().endswith(".pdf")
    ]

    if not pdf_files:
        print("No PDF documents found.")
        return

    for filename in pdf_files:

        filepath = os.path.join(
            DOCUMENTS_FOLDER,
            filename
        )

        result = analyze_document(filepath)

        print_analysis(result)


if __name__ == "__main__":
    main()