import plotly.graph_objects as go
import plotly.io as pio

# Data for Arsenal win probabilities
competitions = ["FA Cup", "EFL Cup", "Premier League", "Champions League"]
probabilities = [18, 12, 25, 8]

# Use brand colors as specified in instructions
colors = ["#1FB8CD", "#DB4545", "#2E8B57", "#5D878F"]

# Create horizontal bar chart
fig = go.Figure(go.Bar(
    x=probabilities,
    y=competitions,
    orientation='h',
    marker_color=colors,
    text=[f"{p}%" for p in probabilities],
    textposition='inside',
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title="Arsenal 2025-26 Win Probabilities",
    xaxis_title="Probability (%)",
    yaxis_title="Competition"
)

# Update axes
fig.update_xaxes(range=[0, 30])
fig.update_yaxes(categoryorder="total ascending")

# Save the chart
fig.write_image("arsenal_probabilities.png")