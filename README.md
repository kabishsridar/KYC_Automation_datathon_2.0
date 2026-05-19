# Autonomous KYC System

An AI-driven Automated Know Your Customer (KYC) application designed to perform identity verification and risk assessment with minimal human intervention.

## Features

*   **Document Upload Interface**: Securely upload ID documents (Passport, Aadhaar, PAN, Driving License).
*   **Live Selfie Capture**: Integrated web camera support for capturing a live photo of the user.
*   **AI Data Extraction**: Automated OCR to extract Name, Date of Birth, and ID Number from uploaded documents.
*   **Face Verification**: Automated comparison between the live selfie and the face detected on the ID document.
*   **Intelligent Risk Assessment**: Rule-based engine that evaluates extracted data, face match confidence, and missing fields to generate a comprehensive risk score (0-100) and an automated decision (Auto Approve, Request More Docs, or Manual Review).
*   **Voice-Enabled Banking MVP (NexaFi)**: A professional, blockchain-secured voice interface for sending money, depositing cash via kiosk, and checking balances, specifically designed for illiterate users with bilingual (English/Tamil) guidance.

## Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS, Lucide React
*   **Backend**: Python, FastAPI, Uvicorn
*   **AI/ML Libraries**: `pytesseract` (OCR), `face_recognition` (Face Matching), `opencv-python` (Image Processing)

## Prerequisites

Ensure you have the following installed on your system:

*   **Node.js & npm** (v18+)
*   **Python** (3.8+)
*   **Tesseract OCR**: You must have the [Tesseract OCR engine](https://github.com/tesseract-ocr/tesseract) installed on your system and accessible in your system's PATH.
*   **C++ Build Tools**: Required by the `face_recognition` library (specifically `dlib`). On Windows, this usually means installing Visual Studio Build Tools.

## Getting Started

Navigate to the root directory, create a virtual environment, and install the Python dependencies.

```bash
# Create a virtual environment in the root directory
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Run NexaFi Voice Banking MVP (Kiosk)

The MVP is located in the `v2/` directory and can be served using any local web server.

```bash
cd v2
# Using Python's built-in server
python -m http.server 8080
```
Open your browser at `http://localhost:8080`.

### 3. Backend Setup (FastAPI)

Run the FastAPI server:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The backend API will be available at `http://localhost:8000`.

### 2. Frontend Setup (React + Vite)

Open a new terminal window, navigate to the frontend directory, and install the Node modules.

```bash
cd frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend application will be accessible in your browser at `http://localhost:5173`.

## Usage

1.  Open the frontend application in your browser.
2.  Enter your **Legal Name**.
3.  Upload an image of your **ID Document**.
4.  Allow camera permissions and capture a **Live Face Photo**.
5.  Click **Verify Identity**.
6.  The backend will process the images and return a **Status Dashboard** displaying the automated decision, risk score, and detailed verification results.

## Project Structure

```
datathon_2.0/
├── v2/                       # NexaFi Voice Banking MVP
│   ├── css/                  # Modular styles (Base, Layout, Components, Blockchain)
│   ├── js/                   # Modular logic (Voice, Ledger, Navigation, Flows)
│   └── index.html            # Main Entry Point
├── backend/                  # Python FastAPI application
│   ├── main.py               # API endpoints
│   └── services/             # AI processing logic
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # UI Components
│   │   └── App.jsx           # Main logic
├── requirements.txt          # Python dependencies
├── venv/                     # Python Virtual Environment
└── README.md                 # Project documentation
```
