import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
from datetime import datetime
import json

# Load the data
data = {"timeline": [{"competition": "EFL Cup", "start": "2025-09-23", "end": "2026-02-28", "win_probability": 12}, {"competition": "FA Cup", "start": "2026-01-10", "end": "2026-05-16", "win_probability": 18}, {"competition": "Premier League", "start": "2025-08-17", "end": "2026-05-24", "win_probability": 25}, {"competition": "Champions League", "start": "2025-09-16", "end": "2026-05-30", "win_probability": 8}]}

# Convert to dataframe
df = pd.DataFrame(data['timeline'])

# Convert dates to datetime
df['start'] = pd.to_datetime(df['start'])
df['end'] = pd.to_datetime(df['end'])

# Sort by start date for better visualization
df = df.sort_values('start')

# Abbreviate competition names to fit 15 character limit
df['comp_short'] = df['competition'].replace({
    'Premier League': 'Prem League', 
    'Champions League': 'Champions Lg',
    'EFL Cup': 'EFL Cup',
    'FA Cup': 'FA Cup'
})

# Create timeline chart using px.timeline
fig = px.timeline(df, x_start="start", x_end="end", y="comp_short", 
                  color="comp_short",
                  color_discrete_sequence=['#1FB8CD', '#DB4545', '#2E8B57', '#5D878F'])

fig.update_layout(
    title="Arsenal 2025-26 Timeline",
    xaxis_title="Date",
    yaxis_title="Competition",
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

fig.write_image("arsenal_timeline.png")