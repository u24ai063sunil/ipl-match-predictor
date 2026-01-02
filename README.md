# 🏏 IPL Match Predictor

A Machine Learning-based web application that predicts the outcome of Indian Premier League (IPL) cricket matches using historical data.

🔗 **Live Demo:** https://ipl-match-predictor.vercel.app/

---

## 📌 About

This project applies data science and machine learning techniques to predict the likely winner of an IPL match based on team statistics, player performances, and historical results.

It’s built with a Python ML backend and deployed as a user-friendly web app using Vercel.

---

## 🧠 Key Features

✔ Predicts match outcomes using trained machine learning models  
✔ Clean and intuitive web interface  
✔ Fast, real-time predictions  
✔ Responsive design for all screen sizes

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| ML Model | Python, Scikit-Learn |
| Backend | FastAPI  |
| Frontend | HTML, CSS, JavaScript ,React |
| Deployment | Vercel |
| Data Processing | Pandas, NumPy |

---

## 🧾 Dataset

The prediction model is trained on historical IPL match data. The dataset includes match details like:
- Team names
- Scores
- Toss results
- Venue
- Player statistics
- Win/Loss outcomes

DataSource :-
https://cricsheet.org/downloads/#experimental

---

## 🚀 Live Preview

Here’s the live application you can try:

👉 https://ipl-match-predictor.vercel.app/

---

## 🧪 How It Works

1. A machine learning model is trained on historical match data.
2. Users select teams and relevant match details.
3. The model predicts the winner with displayed confidence.

---

## 🛠️ Installation (Local)

To set up the project locally:

```bash
# Clone the repo
git clone https://github.com/u24ai063sunil/ipl-match-predictor.git

# Navigate to project folder
cd ipl-match-predictor

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run locally
python app.py   # or flask run / uvicorn main:app
