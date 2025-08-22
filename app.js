// Arsenal Cup Winning Prediction Dashboard JavaScript

// Application Data
const arsenalData = {
    competitions: {
        'premier-league': {
            name: 'Premier League',
            baseProbability: 0.25,
            currentProbability: 0.25,
            startDate: '2025-08-17',
            endDate: '2026-05-24',
            difficulty: 4
        },
        'fa-cup': {
            name: 'FA Cup',
            baseProbability: 0.18,
            currentProbability: 0.18,
            startDate: '2026-01-10',
            endDate: '2026-05-16',
            difficulty: 3
        },
        'efl-cup': {
            name: 'EFL Cup',
            baseProbability: 0.12,
            currentProbability: 0.12,
            startDate: '2025-09-23',
            endDate: '2026-02-28',
            difficulty: 2
        },
        'champions-league': {
            name: 'Champions League',
            baseProbability: 0.08,
            currentProbability: 0.08,
            startDate: '2025-09-16',
            endDate: '2026-05-30',
            difficulty: 5
        }
    },
    
    factors: {
        'squad-quality': { weight: 0.20, baseValue: 8.3, currentValue: 8.3 },
        'manager-exp': { weight: 0.15, baseValue: 8.0, currentValue: 8.0 },
        'squad-depth': { weight: 0.15, baseValue: 8.5, currentValue: 8.5 },
        'recent-form': { weight: 0.10, baseValue: 8.2, currentValue: 8.2 },
        'mental-strength': { weight: 0.10, baseValue: 7.2, currentValue: 7.2 }
    }
};

// Chart instance
let probabilitiesChart = null;

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeChart();
    setupSliders();
    setupFilterButtons();
    setupExportButton();
    setupCompetitionCards();
    updateAllDisplays();
});

// Initialize the probabilities chart
function initializeChart() {
    const ctx = document.getElementById('probabilitiesChart').getContext('2d');
    
    const chartData = {
        labels: ['Premier League', 'FA Cup', 'EFL Cup', 'Champions League'],
        datasets: [{
            label: 'Win Probability (%)',
            data: [25, 18, 12, 8],
            backgroundColor: [
                '#DC143C',
                '#FF6B6B', 
                '#B91C3C',
                '#8B0000'
            ],
            borderColor: '#FFFFFF',
            borderWidth: 2,
            borderRadius: 6
        }]
    };

    const config = {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#FFFFFF',
                    bodyColor: '#FFFFFF',
                    borderColor: '#DC143C',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + '% chance to win';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 30,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(220, 20, 60, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            }
        }
    };

    probabilitiesChart = new Chart(ctx, config);
}

// Setup slider controls with proper event handling
function setupSliders() {
    Object.keys(arsenalData.factors).forEach(factorId => {
        const slider = document.getElementById(factorId);
        const valueDisplay = slider.parentElement.querySelector('.slider-value');
        
        // Set initial value
        slider.value = arsenalData.factors[factorId].currentValue;
        valueDisplay.textContent = arsenalData.factors[factorId].currentValue.toFixed(1);
        
        // Add event listeners for real-time updates
        slider.addEventListener('input', function(e) {
            const value = parseFloat(e.target.value);
            arsenalData.factors[factorId].currentValue = value;
            valueDisplay.textContent = value.toFixed(1);
            
            // Update probabilities and displays immediately
            updateProbabilities();
            updateAllDisplays();
        });
        
        // Also handle change event for better compatibility
        slider.addEventListener('change', function(e) {
            const value = parseFloat(e.target.value);
            arsenalData.factors[factorId].currentValue = value;
            valueDisplay.textContent = value.toFixed(1);
            
            updateProbabilities();
            updateAllDisplays();
        });
    });
}

// Calculate updated probabilities based on factor changes
function updateProbabilities() {
    // Calculate overall impact multiplier based on factor changes
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    Object.values(arsenalData.factors).forEach(factor => {
        totalWeightedScore += (factor.currentValue / 10) * factor.weight;
        totalWeight += factor.weight;
    });
    
    // Calculate impact multiplier (how much factors affect base probabilities)
    const averageFactorScore = totalWeightedScore / totalWeight;
    const impactMultiplier = averageFactorScore * 1.3; // Amplify the impact
    
    // Update each competition probability with some variation
    Object.keys(arsenalData.competitions).forEach(comp => {
        const baseProb = arsenalData.competitions[comp].baseProbability;
        let multiplier = impactMultiplier;
        
        // Add specific adjustments for each competition
        if (comp === 'fa-cup') multiplier *= 1.1; // Arsenal's FA Cup pedigree
        if (comp === 'efl-cup') multiplier *= 0.9; // Lower priority competition
        if (comp === 'champions-league') multiplier *= 0.8; // More difficult
        
        const newProb = Math.min(0.45, Math.max(0.03, baseProb * multiplier));
        arsenalData.competitions[comp].currentProbability = newProb;
    });
}

// Update all displays at once
function updateAllDisplays() {
    updateCardProbabilities();
    updateOverallProbability();
    updateChart();
    updateInsights();
}

// Update probability displays in competition cards
function updateCardProbabilities() {
    const cards = document.querySelectorAll('.competition-card');
    cards.forEach(card => {
        const competition = card.dataset.competition;
        if (arsenalData.competitions[competition]) {
            const probabilityElement = card.querySelector('.probability');
            const newProb = Math.round(arsenalData.competitions[competition].currentProbability * 100);
            probabilityElement.textContent = newProb + '%';
        }
    });
}

// Update overall trophy probability in header
function updateOverallProbability() {
    // Calculate at least one trophy probability
    const probs = Object.values(arsenalData.competitions).map(comp => comp.currentProbability);
    const noTrophyProb = probs.reduce((acc, prob) => acc * (1 - prob), 1);
    const atLeastOneProb = 1 - noTrophyProb;
    
    const overallElement = document.querySelector('.probability-highlight');
    if (overallElement) {
        overallElement.textContent = Math.round(atLeastOneProb * 100) + '%';
    }
}

// Update the chart with new data
function updateChart() {
    if (probabilitiesChart) {
        const newData = Object.values(arsenalData.competitions).map(comp => 
            Math.round(comp.currentProbability * 100)
        );
        
        probabilitiesChart.data.datasets[0].data = newData;
        probabilitiesChart.update('active');
    }
}

// Setup filter buttons
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterCompetitions(filter);
        });
    });
}

// Filter competitions based on selection
function filterCompetitions(filter) {
    const cards = document.querySelectorAll('.competition-card');
    
    cards.forEach(card => {
        const competition = card.dataset.competition;
        
        if (filter === 'all' || competition === filter) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
            card.style.border = '2px solid #DC143C';
        } else {
            card.style.opacity = '0.4';
            card.style.transform = 'translateY(0) scale(0.95)';
            card.style.border = '2px solid transparent';
        }
    });
    
    // Update chart to show filtered data
    updateChartForFilter(filter);
}

// Update chart based on filter
function updateChartForFilter(filter) {
    if (!probabilitiesChart) return;
    
    if (filter === 'all') {
        // Show all competitions
        probabilitiesChart.data.labels = ['Premier League', 'FA Cup', 'EFL Cup', 'Champions League'];
        probabilitiesChart.data.datasets[0].data = Object.values(arsenalData.competitions).map(comp => 
            Math.round(comp.currentProbability * 100)
        );
        probabilitiesChart.data.datasets[0].backgroundColor = [
            '#DC143C', '#FF6B6B', '#B91C3C', '#8B0000'
        ];
    } else {
        // Show only selected competition
        const competition = arsenalData.competitions[filter];
        if (competition) {
            probabilitiesChart.data.labels = [competition.name];
            probabilitiesChart.data.datasets[0].data = [Math.round(competition.currentProbability * 100)];
            probabilitiesChart.data.datasets[0].backgroundColor = ['#DC143C'];
        }
    }
    
    probabilitiesChart.update('active');
}

// Setup export functionality
function setupExportButton() {
    const exportBtn = document.getElementById('export-btn');
    
    exportBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Visual feedback
        const originalText = this.textContent;
        this.textContent = 'Exporting...';
        this.disabled = true;
        
        // Generate and download export data
        setTimeout(() => {
            const exportData = generateExportData();
            downloadJSON(exportData, 'arsenal-cup-predictions.json');
            
            // Reset button
            this.textContent = 'Exported Successfully!';
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 2000);
        }, 500);
    });
}

// Generate export data
function generateExportData() {
    const exportData = {
        generatedAt: new Date().toISOString(),
        season: '2025-26',
        overallTrophyProbability: calculateOverallProbability(),
        competitions: {},
        factors: {},
        insights: {
            mostLikelyWin: getMostLikelyCompetition(),
            earliestPossibleWin: 'February 28, 2026 (EFL Cup Final)',
            keySuccessFactor: 'Squad Quality (20% weighting)',
            currentFormScore: calculateCurrentFormScore()
        }
    };
    
    // Add competition data
    Object.entries(arsenalData.competitions).forEach(([key, comp]) => {
        exportData.competitions[key] = {
            name: comp.name,
            probability: Math.round(comp.currentProbability * 100) + '%',
            startDate: comp.startDate,
            endDate: comp.endDate,
            difficulty: comp.difficulty + '/5'
        };
    });
    
    // Add factor data
    Object.entries(arsenalData.factors).forEach(([key, factor]) => {
        exportData.factors[key.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())] = {
            weight: Math.round(factor.weight * 100) + '%',
            currentValue: factor.currentValue + '/10',
            baseValue: factor.baseValue + '/10',
            impact: factor.currentValue > factor.baseValue ? 'Positive' : 'Negative'
        };
    });
    
    return exportData;
}

// Calculate overall probability
function calculateOverallProbability() {
    const probs = Object.values(arsenalData.competitions).map(comp => comp.currentProbability);
    const noTrophyProb = probs.reduce((acc, prob) => acc * (1 - prob), 1);
    return Math.round((1 - noTrophyProb) * 100) + '%';
}

// Calculate current form score
function calculateCurrentFormScore() {
    const totalScore = Object.values(arsenalData.factors).reduce((sum, factor) => {
        return sum + factor.currentValue * factor.weight;
    }, 0);
    return (totalScore * 10).toFixed(1) + '/10';
}

// Get most likely competition to win
function getMostLikelyCompetition() {
    let maxProb = 0;
    let mostLikely = '';
    
    Object.values(arsenalData.competitions).forEach(comp => {
        if (comp.currentProbability > maxProb) {
            maxProb = comp.currentProbability;
            mostLikely = comp.name;
        }
    });
    
    return mostLikely;
}

// Download JSON file
function downloadJSON(data, filename) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Setup competition card interactions
function setupCompetitionCards() {
    const cards = document.querySelectorAll('.competition-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const competition = this.dataset.competition;
            highlightCompetition(competition);
        });
    });
}

// Highlight specific competition
function highlightCompetition(competition) {
    // Update filter to show only this competition
    const filterBtn = document.querySelector(`[data-filter="${competition}"]`);
    if (filterBtn) {
        filterBtn.click();
    }
    
    // Scroll to prediction model section
    const predictionSection = document.querySelector('.prediction-model');
    if (predictionSection) {
        predictionSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Real-time updates for insights panel
function updateInsights() {
    const mostLikelyElement = document.querySelector('.insight-card.primary .insight-value');
    if (mostLikelyElement) {
        const mostLikely = getMostLikelyCompetition();
        mostLikelyElement.textContent = mostLikely;
    }
}

// Handle responsive chart resizing
window.addEventListener('resize', function() {
    if (probabilitiesChart) {
        probabilitiesChart.resize();
    }
});

// Reset function for debugging
function resetDashboard() {
    Object.keys(arsenalData.factors).forEach(factorId => {
        arsenalData.factors[factorId].currentValue = arsenalData.factors[factorId].baseValue;
        const slider = document.getElementById(factorId);
        if (slider) {
            slider.value = arsenalData.factors[factorId].baseValue;
            const valueDisplay = slider.parentElement.querySelector('.slider-value');
            if (valueDisplay) {
                valueDisplay.textContent = arsenalData.factors[factorId].baseValue.toFixed(1);
            }
        }
    });
    
    Object.keys(arsenalData.competitions).forEach(comp => {
        arsenalData.competitions[comp].currentProbability = arsenalData.competitions[comp].baseProbability;
    });
    
    updateAllDisplays();
}

// Performance monitoring
const startTime = performance.now();
window.addEventListener('load', function() {
    const loadTime = performance.now() - startTime;
    console.log(`Arsenal Dashboard loaded in ${loadTime.toFixed(2)}ms`);
});