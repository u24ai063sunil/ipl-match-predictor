from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import joblib
import pandas as pd

from model_utils import build_feature_row, compute_team_features

# Load model & data
model = joblib.load("models/calibrated_logistic_v2.joblib")
feature_cols = joblib.load("models/feature_columns_v2.joblib")

career = pd.read_csv("data/processed/player_career_stats.csv")
recent = pd.read_csv("data/processed/player_recent_form.csv")

career["player"] = career["player"].str.strip()
recent["player"] = recent["player"].str.strip()

app = FastAPI(title="IPL Match Predictor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Schemas ----------
class Toss(BaseModel):
    winner: str
    decision: str   # "bat" or "field"

class MatchRequest(BaseModel):
    team1: str
    team2: str
    xi1: List[str]
    xi2: List[str]
    venue: str
    toss: Toss

# ---------- Routes ----------
@app.get("/")
def root():
    return {"status": "API running"}

@app.post("/predict")
def predict_match(req: MatchRequest):
    t1 = compute_team_features(req.xi1, career, recent)
    t2 = compute_team_features(req.xi2, career, recent)

    feature_row = build_feature_row(
        team1=req.team1,
        team2=req.team2,
        t1=t1,
        t2=t2,
        venue=req.venue,
        toss_winner=req.toss.winner,
        toss_decision=req.toss.decision,
    )

    X = pd.DataFrame([feature_row], columns=feature_cols)
    p1 = model.predict_proba(X)[0, 1]

    return {
        "team1": req.team1,
        "team2": req.team2,
        "team1_win_prob": round(float(p1), 3),
        "team2_win_prob": round(float(1 - p1), 3),
    }

