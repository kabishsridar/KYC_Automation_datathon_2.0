# NexaFi v2: Blockchain-Secured Voice Banking

## Overview
NexaFi is a professional, AI-powered financial infrastructure designed specifically for non-literate and rural users. It combines **Bilingual Voice Guidance** with **Blockchain-based Security** to ensure trust and ease of use.

## Core Features
1. **Voice-Guided Banking**: Step-by-step instructions in English and Tamil.
2. **Blockchain Security**: Every transaction and credential is hashed and logged on a simulated immutable ledger.
3. **Kiosk Deposit System**: Bridging physical cash and digital assets via agent-assisted kiosks.
4. **Illiterate-Friendly UI**: High-contrast, large-target design with visual iconography.

## Setup Instructions

### 1. Create Virtual Environment
Ensure you have Python 3.8+ installed.

```bash
# Navigate to v2 folder
cd v2

# Create venv
python -m venv venv

# Activate venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Application
The application is a purely modular SPA. You can serve it using the built-in Python server:

```bash
python -m http.server 8080
```
Visit `http://localhost:8080` in your browser.

## Security Architecture
- **Cryptographic PIN Entry**: Silent mode prevents eavesdropping during credential input.
- **Distributed Ledger**: Transactions generate unique hashes representing a block on the network.
- **Credential Hashing**: User credentials are encrypted using SHA-256 (simulated) upon local initialization.

## Directory Structure
- `css/`: Modular styles (Blockchain, Layout, Components).
- `js/`: Modular logic (Voice Engine, Ledger Sync, Route Control).
- `index.html`: Main cryptographic shell.
