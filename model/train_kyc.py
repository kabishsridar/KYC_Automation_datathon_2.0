import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score
import joblib
import os

def generate_kyc_data(n_samples=1000):
    np.random.seed(42)
    
    # Generate synthetic features
    face_match = np.random.randint(40, 100, n_samples)
    liveness = np.random.randint(30, 100, n_samples)
    tamper_risk = np.random.randint(0, 80, n_samples)
    doc_auth = np.random.randint(40, 100, n_samples)
    consistency = np.random.randint(40, 100, n_samples)
    fraud_risk = np.random.randint(0, 70, n_samples)
    
    data = pd.DataFrame({
        'face_match_confidence': face_match,
        'liveness_score': liveness,
        'tamper_risk_score': tamper_risk,
        'doc_auth_score': doc_auth,
        'identity_consistency': consistency,
        'fraud_pattern_risk': fraud_risk
    })
    
    # Define verification logic (Ground Truth)
    # A submission is verified if face match is high, liveness is high, and tamper/fraud risk is low.
    def label_verification(row):
        score = 0
        if row['face_match_confidence'] > 70: score += 20
        if row['liveness_score'] > 60: score += 20
        if row['tamper_risk_score'] < 30: score += 20
        if row['doc_auth_score'] > 75: score += 20
        if row['identity_consistency'] > 70: score += 10
        if row['fraud_pattern_risk'] < 25: score += 10
        
        return 1 if score >= 60 else 0

    data['is_verified'] = data.apply(label_verification, axis=1)
    return data

def train_kyc_model():
    print("Generating synthetic KYC dataset...")
    df = generate_kyc_data(2000)
    
    X = df.drop('is_verified', axis=1)
    y = df['is_verified']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Classifier for KYC...")
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train, y_train)
    
    # Save the model
    model_dir = r"d:\datathon_2.0\model"
    os.makedirs(model_dir, exist_ok=True)
    joblib.dump(model, os.path.join(model_dir, "kyc_classifier.pkl"))
    df.to_csv(os.path.join(model_dir, "kyc_synthetic_data.csv"), index=False)
    
    print(f"Model saved to {os.path.join(model_dir, 'kyc_classifier.pkl')}")
    
if __name__ == "__main__":
    train_kyc_model()
