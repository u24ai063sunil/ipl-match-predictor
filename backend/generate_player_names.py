import pandas as pd
import json

# Load CSV
df = pd.read_csv("data/processed/player.csv")

# Extract unique player names
players = (
    df["player"]
    .dropna()
    .astype(str)
    .str.strip()
    .unique()
)

players = sorted(players)

# Write JS file
output_path = "../frontend/src/data/playerNames.js"

with open(output_path, "w", encoding="utf-8") as f:
    f.write("export const PLAYER_NAMES = ")
    json.dump(players, f, indent=2)
    f.write(";")

print(f"✅ Generated {len(players)} player names")
print(f"📁 Saved to {output_path}")
