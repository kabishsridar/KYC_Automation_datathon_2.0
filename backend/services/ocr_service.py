import pytesseract
from PIL import Image
import io
import re

def ocr_extract_data(image_bytes: bytes) -> dict:
    """
    Extracts text from an image byte stream using Tesseract OCR.
    Parses out name, DOB, and standard ID numbers using basic regex.
    """
    try:
        # Load image from bytes
        image = Image.open(io.BytesIO(image_bytes))
        
        # Extract raw text
        raw_text = pytesseract.image_to_string(image)
        
        # Parse fields from raw_text
        extracted_data = {
            "raw_text": raw_text,
            "name": extract_name(raw_text),
            "dob": extract_dob(raw_text),
            "id_number": extract_id_number(raw_text)
        }
        
        return extracted_data
        
    except Exception as e:
        print(f"OCR Error: {e}")
        return {
            "raw_text": "",
            "name": None,
            "dob": None,
            "id_number": None
        }

def extract_name(text: str):
    # Highly simplified logic; in a production setting you'd use NER (SpaCy) or an LLM.
    # Looking for Name : or similar
    match = re.search(r'(?i)name[\s:]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)', text)
    if match:
        return match.group(1).strip()
    return None

def extract_dob(text: str):
    # e.g., 01/01/1990 or 01-01-1990
    match = re.search(r'\b(\d{2}[-/]\d{2}[-/]\d{4})\b', text)
    if match:
        return match.group(1).strip()
    return None

def extract_id_number(text: str):
    # Generic regex for PAN (ABCDE1234F) or Aadhar (1234 5678 9012)
    pan_match = re.search(r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b', text)
    if pan_match:
        return pan_match.group(0)
    
    aadhar_match = re.search(r'\b\d{4}\s\d{4}\s\d{4}\b', text)
    if aadhar_match:
        return aadhar_match.group(0)
        
    return None
