"""
Text extraction for uploaded files — PDF, DOCX, and plain text.
"""


class TextExtractor:
    """Extracts plain text from binary document formats."""

    def extract_from_bytes(self, content: bytes, filename: str) -> str:
        """Detect file type by extension and extract text accordingly."""
        ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''
        if ext == 'pdf':
            return self._extract_pdf(content)
        elif ext == 'docx':
            return self._extract_docx(content)
        else:
            return content.decode('utf-8', errors='replace')

    def _extract_pdf(self, content: bytes) -> str:
        from PyPDF2 import PdfReader
        import io

        reader = PdfReader(io.BytesIO(content))
        text = []
        for page in reader.pages:
            text.append(page.extract_text() or '')
        return '\n'.join(text)

    def _extract_docx(self, content: bytes) -> str:
        from docx import Document
        import io

        doc = Document(io.BytesIO(content))
        return '\n'.join(p.text for p in doc.paragraphs)
