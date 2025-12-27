import joblib
import pandas as pd

# Load once (fast)
model = joblib.load("models/calibrated_logistic_v2.joblib")
feature_cols = joblib.load("models/feature_columns_v2.joblib")

def predict_from_features(feature_dict):
    X = pd.DataFrame([feature_dict], columns=feature_cols)
    p1 = model.predict_proba(X)[0,1]

    return {
        "team1_win_prob": round(float(p1), 3),
        "team2_win_prob": round(float(1 - p1), 3)
    }
