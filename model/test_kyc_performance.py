import pandas as pd
import joblib
import os
from sklearn.metrics import accuracy_score, precision_score, classification_report, confusion_matrix

def test_kyc_performance():
    model_path = r"d:\datathon_2.0\model\kyc_classifier.pkl"
    data_path = r"d:\datathon_2.0\model\kyc_synthetic_data.csv"
    
    if not os.path.exists(model_path) or not os.path.exists(data_path):
        print("Model or Data not found. Please run train_kyc.py first.")
        return
    
    # Load model and data
    model = joblib.load(model_path)
    df = pd.read_csv(data_path)
    
    # Use a fresh split or just the whole dataset if it's small (we'll just use the data for demo)
    # To be proper, let's take the last 200 samples
    test_df = df.tail(200)
    X_test = test_df.drop('is_verified', axis=1)
    y_test = test_df['is_verified']
    
    # Predictions
    y_pred = model.predict(X_test)
    
    # Metrics
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    
    print("\n" + "="*45)
    print("      KYC MODEL PERFORMANCE REPORT")
    print("="*45)
    print(f"Accuracy:  {acc:.4%}")
    print(f"Precision: {prec:.4%}")
    print("-" * 45)
    print("Classification Report:")
    print(classification_report(y_test, y_pred, target_names=["REJECTED", "VERIFIED"]))
    
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    print("="*45)
    
    # Sample Output (A mix of verified and rejected for clarity)
    v_samples = test_df[test_df['is_verified'] == 1].head(3)
    r_samples = test_df[test_df['is_verified'] == 0].head(3)
    display_samples = pd.concat([v_samples, r_samples])
    
    results = pd.DataFrame({
        'Face Match': display_samples['face_match_confidence'].map(lambda x: f"{x}%"),
        'Liveness': display_samples['liveness_score'].map(lambda x: f"{x}%"),
        'Tamper Risk': display_samples['tamper_risk_score'].map(lambda x: f"{x}%"),
        'Original Data Status': ["REAL (Verified)" if val == 1 else "FAKE (Rejected)" for val in display_samples['is_verified']],
        'Model Decision': ["VERIFIED" if val == 1 else "REJECTED" for val in model.predict(display_samples.drop('is_verified', axis=1))]
    })
    print("\nDetailed Test Output (Comparing Original Truth vs Model Prediction):")
    print(results)

if __name__ == "__main__":
    test_kyc_performance()
