import numpy as np
import cv2
import io

# Load the standard OpenCV Haar Cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def verify_face(id_image_bytes: bytes, selfie_image_bytes: bytes) -> dict:
    """
    Verifies that the face in the selfie matches the face in the ID card.
    Uses OpenCV basic face detection to ensure a face exists, and mocks the actual matching
    to avoid heavy C++ dependencies like dlib for this prototype.
    """
    try:
        # Convert bytes to numpy arrays for opencv
        id_image = load_image_from_bytes(id_image_bytes)
        selfie_image = load_image_from_bytes(selfie_image_bytes)

        # Convert to grayscale for detection
        id_gray = cv2.cvtColor(id_image, cv2.COLOR_BGR2GRAY)
        selfie_gray = cv2.cvtColor(selfie_image, cv2.COLOR_BGR2GRAY)

        # 1. Detect faces (Using very lenient parameters for ID cards)
        id_faces = face_cascade.detectMultiScale(id_gray, scaleFactor=1.05, minNeighbors=2, minSize=(20, 20))
        selfie_faces = face_cascade.detectMultiScale(selfie_gray, scaleFactor=1.05, minNeighbors=3, minSize=(30, 30))

        if len(id_faces) == 0:
            return {"is_match": False, "is_live": False, "error": "No face found in ID image (OpenCV detection)"}
        
        if len(selfie_faces) == 0:
            return {"is_match": False, "is_live": False, "error": "No face found in selfie image (OpenCV detection)"}

        # 2. Compare faces (Mocked for Prototype to avoid dlib/C++ compiler requirements)
        # In a production environment, you would use DeepFace or face_recognition here.
        is_match = True

        # 3. Liveness Check (Mocked for simplicity)
        is_live = len(selfie_faces) > 0 # Simple surrogate: considered live if face detected

        return {
            "is_match": is_match,
            "is_live": is_live,
            "error": None
        }

    except Exception as e:
        print(f"Face Verification Error: {e}")
        return {
            "is_match": False,
            "is_live": False,
            "error": str(e)
        }

def load_image_from_bytes(image_bytes: bytes):
    # Convert byte stream to cv2 image format
    nparr = np.frombuffer(image_bytes, np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)
