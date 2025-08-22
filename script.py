# Let me create a comprehensive dataset analyzing Arsenal's cup winning potential
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json

# Arsenal's historical cup performance data
arsenal_cup_history = {
    'FA_Cup': {
        'total_wins': 14,
        'last_win': 2020,
        'recent_finals': [2017, 2020],  # Won both
        'recent_performance': 'Strong - most successful FA Cup team in history'
    },
    'EFL_Cup': {
        'total_wins': 2,
        'last_win': 1993,
        'recent_finals': [],
        'recent_performance': 'Poor - 32 years without a win'
    },
    'Premier_League': {
        'total_wins': 13,
        'last_win': 2004,
        'recent_performance': 'Runners-up last 3 seasons (2022-23, 2023-24, 2024-25)'
    },
    'Champions_League': {
        'total_wins': 0,
        'best_recent': 'Semi-finals 2024-25',
        'recent_performance': 'Improving - semi-finals for first time since 2009'
    }
}

# Current season 2025-26 data
current_season_data = {
    'season': '2025-26',
    'manager': 'Mikel Arteta',
    'key_signings': [
        {'player': 'Viktor Gyökeres', 'position': 'Striker', 'fee': '€65.8m', 'from': 'Sporting Lisbon'},
        {'player': 'Martín Zubimendi', 'position': 'DM', 'fee': '€70m', 'from': 'Real Sociedad'},
        {'player': 'Noni Madueke', 'position': 'RW', 'fee': '€56m', 'from': 'Chelsea'},
        {'player': 'Cristhian Mosquera', 'position': 'CB', 'fee': '€15m', 'from': 'Valencia'},
        {'player': 'Christian Nørgaard', 'position': 'DM', 'fee': '€11.6m', 'from': 'Brentford'}
    ],
    'squad_depth_rating': 8.5,  # out of 10
    'defensive_record': 'Best in league last 2 seasons',
    'attacking_upgrade': 'Significant with Gyökeres addition'
}

# Competition schedules and probabilities
competitions_2025_26 = {
    'FA_Cup': {
        'entry_round': 'Third Round',
        'entry_date': '2026-01-10',
        'final_date': '2026-05-16',
        'estimated_probability': 0.18,  # Based on being top 6 team with strong cup history
        'key_factors': ['Historical success', 'Squad depth', 'Arteta cup record']
    },
    'EFL_Cup': {
        'entry_round': 'Third Round',
        'entry_date': '2025-09-23',
        'final_date': '2026-02-28',  # Approximate
        'estimated_probability': 0.12,  # Lower due to poor recent record
        'key_factors': ['Squad rotation', 'Lower priority', 'Poor recent history']
    },
    'Premier_League': {
        'start_date': '2025-08-17',
        'end_date': '2026-05-24',
        'estimated_probability': 0.25,  # Strong chance based on recent form
        'key_factors': ['Three consecutive 2nd places', 'Strong signings', 'Squad maturity']
    },
    'Champions_League': {
        'league_phase_start': '2025-09-16',
        'final_date': '2026-05-30',
        'estimated_probability': 0.08,  # Improving but still challenging
        'key_factors': ['Semi-final experience', 'Squad depth', 'European competition']
    }
}

# Key performance metrics
performance_metrics = {
    'defensive_strength': 9.2,  # Best defense in league
    'attacking_threat': 8.1,   # Improved with Gyökeres
    'squad_depth': 8.5,        # Much improved
    'experience': 7.8,          # Young squad gaining experience
    'manager_tactical': 8.7,    # Arteta's tactical development
    'mental_strength': 7.5      # Area for improvement - converting draws to wins
}

# Create prediction model factors
prediction_factors = pd.DataFrame([
    {'factor': 'Historical FA Cup Success', 'weight': 0.15, 'score': 9.5, 'competition': 'FA_Cup'},
    {'factor': 'Current Squad Quality', 'weight': 0.20, 'score': 8.3, 'competition': 'All'},
    {'factor': 'Manager Experience', 'weight': 0.15, 'score': 8.0, 'competition': 'All'},
    {'factor': 'Squad Depth', 'weight': 0.15, 'score': 8.5, 'competition': 'All'},
    {'factor': 'Recent Form Trajectory', 'weight': 0.10, 'score': 8.2, 'competition': 'All'},
    {'factor': 'Key Signings Impact', 'weight': 0.15, 'score': 8.7, 'competition': 'All'},
    {'factor': 'Mental Resilience', 'weight': 0.10, 'score': 7.2, 'competition': 'All'}
])

print("Arsenal Cup Winning Prediction Analysis")
print("=" * 50)
print()

# Calculate weighted scores
prediction_factors['weighted_score'] = prediction_factors['weight'] * prediction_factors['score']
overall_strength = prediction_factors['weighted_score'].sum()

print(f"Overall Squad Strength Score: {overall_strength:.2f}/10")
print()

print("Competition-Specific Win Probabilities:")
for comp, data in competitions_2025_26.items():
    print(f"{comp}: {data['estimated_probability']*100:.1f}%")

print()
print("Key Factors Analysis:")
for _, row in prediction_factors.iterrows():
    print(f"- {row['factor']}: {row['score']}/10 (Weight: {row['weight']*100:.0f}%)")

# Save the analysis data
analysis_data = {
    'arsenal_cup_history': arsenal_cup_history,
    'current_season_data': current_season_data,
    'competitions_2025_26': competitions_2025_26,
    'performance_metrics': performance_metrics,
    'prediction_factors': prediction_factors.to_dict('records'),
    'overall_strength_score': overall_strength
}

# Save as JSON for the dashboard
with open('arsenal_cup_analysis.json', 'w') as f:
    json.dump(analysis_data, f, indent=2, default=str)

# Create timeline data for dashboard
timeline_data = []

# Add cup competition dates
for comp, data in competitions_2025_26.items():
    if 'entry_date' in data:
        timeline_data.append({
            'date': data['entry_date'],
            'event': f"{comp} starts",
            'competition': comp,
            'probability': data['estimated_probability']
        })
    
    if 'final_date' in data:
        timeline_data.append({
            'date': data['final_date'],
            'event': f"{comp} Final",
            'competition': comp,
            'probability': data['estimated_probability']
        })
    elif comp == 'Premier_League':
        timeline_data.append({
            'date': data['end_date'],
            'event': f"{comp} Final Day",
            'competition': comp,
            'probability': data['estimated_probability']
        })

timeline_df = pd.DataFrame(timeline_data)
timeline_df['date'] = pd.to_datetime(timeline_df['date'])
timeline_df = timeline_df.sort_values('date')

print("\nKey Upcoming Dates:")
for _, row in timeline_df.iterrows():
    print(f"{row['date'].strftime('%d %b %Y')}: {row['event']} ({row['probability']*100:.1f}% win chance)")

# Save timeline for dashboard
timeline_df.to_csv('arsenal_cup_timeline.csv', index=False)

print(f"\nData saved to:")
print("- arsenal_cup_analysis.json")
print("- arsenal_cup_timeline.csv")