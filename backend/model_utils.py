import pandas as pd

# -------------------------------------------------
# Team feature computation
# -------------------------------------------------

def compute_team_features(xi, career_df, recent_df):
    """
    Computes aggregated team features from player-level data.
    """

    # Career stats
    c = career_df[career_df["player"].isin(xi)]

    # Recent form: take last match per player
    r = recent_df[recent_df["player"].isin(xi)]
    if not r.empty:
        r = r.groupby("player").tail(1)

    def safe_mean(series, default=0.0):
        if series is None or series.empty or series.isna().all():
            return default
        return float(series.mean())

    return {
        "batting": safe_mean(c.get("batting_strength")),
        "bowling": safe_mean(c.get("bowling_strength")),
        "overall": safe_mean(c.get("overall_strength")),

        "recent_runs": safe_mean(r.get("recent_runs")),
        "recent_wickets": safe_mean(r.get("recent_wickets")),
        "recent_econ": safe_mean(r.get("recent_economy")),
    }


# -------------------------------------------------
# Home advantage logic
# -------------------------------------------------

TEAM_CITY = {
    "Chennai Super Kings": "Chennai",
    "Mumbai Indians": "Mumbai",
    "Royal Challengers Bangalore": "Bangalore",
    "Kolkata Knight Riders": "Kolkata",
    "Delhi Capitals": "Delhi",
    "Rajasthan Royals": "Jaipur",
    "Sunrisers Hyderabad": "Hyderabad",
    "Punjab Kings": "Chandigarh",
}

def is_home_team(team, venue):
    city = TEAM_CITY.get(team)
    if not city:
        return 0
    return int(city.lower() in venue.lower())


# -------------------------------------------------
# Feature engineering (Step 5 – FINAL)
# -------------------------------------------------

def build_feature_row(
    team1,
    team2,
    t1,
    t2,
    venue,
    toss_winner,
    toss_decision,
    venue_team1_win_rate=0.5
):
    """
    Builds final ML feature row using DIFFERENCE-based features.
    """

    return {
        # 🔥 Pure cricket strength diffs
        "batting_diff": t1["batting"] - t2["batting"],
        "bowling_diff": t1["bowling"] - t2["bowling"],
        "overall_diff": t1["overall"] - t2["overall"],

        # 🔥 Recent form diffs
        "recent_runs_diff": t1["recent_runs"] - t2["recent_runs"],
        "recent_wickets_diff": t1["recent_wickets"] - t2["recent_wickets"],
        "recent_econ_diff": t1["recent_econ"] - t2["recent_econ"],

        # 🔥 Context features
        "toss_adv": int(toss_winner == team1),
        "home_adv": is_home_team(team1, venue),
        "venue_win_rate_diff": venue_team1_win_rate - 0.5,
    }
