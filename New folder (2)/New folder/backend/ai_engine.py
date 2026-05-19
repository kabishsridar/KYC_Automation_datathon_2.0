def analyze_heart_rate(heart_rate: float) -> str:
    """
    Analyzes heart rate and returns appropriate alert level.
    Normal: 60-100 bpm
    Warning: 50-60 bpm or 100-120 bpm
    Critical: <50 bpm or >120 bpm
    """
    if heart_rate < 50:
        return "CRITICAL_LOW"
    elif heart_rate > 120:
        return "CRITICAL_HIGH"
    elif 50 <= heart_rate < 60:
        return "WARNING_LOW"
    elif 100 < heart_rate <= 120:
        return "WARNING_HIGH"
    else:
        return "NORMAL"

def generate_alert_message(alert_type: str, heart_rate: float) -> str:
    if alert_type == "CRITICAL_LOW":
        return f"Heart rate dropped to {heart_rate} bpm. Possible seizure or fainting risk detected. Please check immediately."
    elif alert_type == "CRITICAL_HIGH":
        return f"Heart rate spiked to {heart_rate} bpm. High stress or cardiac risk detected. Please check immediately."
    elif alert_type == "WARNING_LOW":
        return f"Warning: Heart rate is unusually low ({heart_rate} bpm)."
    elif alert_type == "WARNING_HIGH":
        return f"Warning: Heart rate is unusually high ({heart_rate} bpm)."
    return ""
