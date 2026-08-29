from rag.documents_ai import analyze_document


def compare_field(application_value, document_value):
    """
    Compare one application field with one document field.

    Returns:
    MATCH
    MISMATCH
    UNKNOWN
    """

    if (
        application_value is None
        or document_value is None
        or str(document_value).upper() == "UNKNOWN"
    ):
        return "UNKNOWN"

    application_value = str(application_value).strip().lower()
    document_value = str(document_value).strip().lower()

    if application_value == document_value:
        return "MATCH"

    return "MISMATCH"


def compare_documents(application_data, document_data):
    """
    Compare application data with extracted document data.
    """

    results = {}

    fields = [
        "company",
        "approval",
        "issue_date",
        "expiry_date"
    ]

    for field in fields:

        application_value = application_data.get(field)
        document_value = document_data.get(field)

        results[field] = {
            "application_value": application_value,
            "document_value": document_value,
            "status": compare_field(
                application_value,
                document_value
            )
        }

    return results


def get_overall_status(comparison):
    """
    Generate an overall verification result.

    VERIFIED:
        All required fields match.

    FAILED:
        At least one required field mismatches.

    REVIEW_REQUIRED:
        No mismatch, but one or more fields are unknown.
    """

    statuses = [
        data["status"]
        for data in comparison.values()
    ]

    if "MISMATCH" in statuses:
        return "FAILED"

    if "UNKNOWN" in statuses:
        return "REVIEW_REQUIRED"

    return "VERIFIED"


def compare_pdf_with_application(pdf_path, application_data):
    """
    Extract fields from a PDF and compare them
    with application data.
    """

    document_result = analyze_document(pdf_path)

    document_fields = document_result["fields"]

    comparison = compare_documents(
        application_data,
        document_fields
    )

    overall_status = get_overall_status(
        comparison
    )

    return {
        "filename": document_result["filename"],
        "document_type": document_result["document_type"],
        "overall_status": overall_status,
        "comparison": comparison
    }


if __name__ == "__main__":

    pdf_path = "rag/documents/approval_test.pdf"

    application_data = {
        "company": "XYZ Industries Pvt Ltd",
        "approval": "Fire Safety Approval",
        "issue_date": "01-01-2026",
        "expiry_date": "31-12-2026"
    }

    result = compare_pdf_with_application(
        pdf_path,
        application_data
    )

    print("\nDocument Comparison")
    print("-------------------")

    print("File:", result["filename"])
    print("Document Type:", result["document_type"])

    print("\nOverall Status:")
    print(result["overall_status"])

    print("\nComparison Results:")

    for field, data in result["comparison"].items():

        print(f"\n{field}")
        print("Application:", data["application_value"])
        print("Document:", data["document_value"])
        print("Status:", data["status"])