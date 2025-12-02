// Main Game Controller
// Manages game state, UI updates, and statistics

class RockPaperScissorsGame {
    constructor() {
        this.ai = new RockPaperScissorsAI();

        // Game statistics
        this.stats = {
            playerWins: 0,
            aiWins: 0,
            draws: 0,
            totalGames: 0,
            winRateHistory: []
        };

        // Charts
        this.tendencyChart = null;
        this.winRateChart = null;

        // Load saved stats from localStorage
        this.loadStats();

        // Initialize UI
        this.initializeUI();
        this.updateUI();
    }

    /**
     * Initialize event listeners and UI elements
     */
    initializeUI() {
        // Move buttons
        document.getElementById('rock-btn').addEventListener('click', () => this.playRound('rock'));
        document.getElementById('paper-btn').addEventListener('click', () => this.playRound('paper'));
        document.getElementById('scissors-btn').addEventListener('click', () => this.playRound('scissors'));

        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => this.reset());

        // Initialize charts
        this.initializeCharts();
    }

    /**
     * Play a round of Rock-Paper-Scissors
     */
    playRound(playerMove) {
        // Get AI's move (based on prediction)
        const aiMove = this.ai.getMove();

        // Determine winner
        const result = this.determineWinner(playerMove, aiMove);

        // Update statistics
        this.updateStats(result);

        // Teach AI the player's move
        this.ai.learn(playerMove);

        // Update UI with results
        this.displayRoundResult(playerMove, aiMove, result);
        this.updateUI();
        this.saveStats();

        // Add animation
        this.animateResult(result);
    }

    /**
     * Determine the winner of a round
     */
    determineWinner(player, ai) {
        if (player === ai) return 'draw';

        const winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };

        return winConditions[player] === ai ? 'win' : 'lose';
    }

    /**
     * Update game statistics
     */
    updateStats(result) {
        this.stats.totalGames++;

        if (result === 'win') {
            this.stats.playerWins++;
        } else if (result === 'lose') {
            this.stats.aiWins++;
        } else {
            this.stats.draws++;
        }

        // Calculate AI win rate for history
        const aiWinRate = this.stats.totalGames > 0
            ? (this.stats.aiWins / this.stats.totalGames) * 100
            : 0;

        this.stats.winRateHistory.push(aiWinRate);

        // Keep history manageable
        if (this.stats.winRateHistory.length > 50) {
            this.stats.winRateHistory.shift();
        }
    }

    /**
     * Display the result of the current round
     */
    displayRoundResult(playerMove, aiMove, result) {
        // Update move displays
        document.getElementById('player-move').textContent = this.getMoveEmoji(playerMove);
        document.getElementById('ai-move').textContent = this.getMoveEmoji(aiMove);

        // Update result text
        const resultElement = document.getElementById('result-text');
        const resultMessages = {
            win: '🎉 You Win!',
            lose: '🤖 AI Wins!',
            draw: '🤝 Draw!'
        };

        resultElement.textContent = resultMessages[result];
        resultElement.className = `result-${result}`;

        // Update confidence display
        const confidence = this.ai.getConfidence();
        document.getElementById('confidence-value').textContent = `${confidence}%`;
        document.getElementById('confidence-bar').style.width = `${confidence}%`;

        // Update recent history
        this.updateHistoryDisplay();
    }

    /**
     * Get emoji for move
     */
    getMoveEmoji(move) {
        const emojis = {
            rock: '🪨',
            paper: '📄',
            scissors: '✂️'
        };
        return emojis[move];
    }

    /**
     * Update all UI elements
     */
    updateUI() {
        // Update score
        document.getElementById('player-score').textContent = this.stats.playerWins;
        document.getElementById('ai-score').textContent = this.stats.aiWins;
        document.getElementById('draw-count').textContent = this.stats.draws;
        document.getElementById('total-games').textContent = this.stats.totalGames;

        // Update charts
        this.updateCharts();

        // Update Markov matrix
        this.updateMarkovDisplay();

        // Update patterns
        this.updatePatternsDisplay();
    }

    /**
     * Initialize Chart.js charts
     */
    initializeCharts() {
        // Tendency Chart (Pie)
        const tendencyCtx = document.getElementById('tendency-chart').getContext('2d');
        this.tendencyChart = new Chart(tendencyCtx, {
            type: 'doughnut',
            data: {
                labels: ['Rock', 'Paper', 'Scissors'],
                datasets: [{
                    data: [33.33, 33.33, 33.33],
                    backgroundColor: [
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                        'rgba(34, 211, 238, 0.8)'
                    ],
                    borderColor: [
                        'rgba(139, 92, 246, 1)',
                        'rgba(236, 72, 153, 1)',
                        'rgba(34, 211, 238, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#e2e8f0',
                            font: { size: 12 }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Player Tendencies',
                        color: '#e2e8f0',
                        font: { size: 14, weight: 'bold' }
                    }
                }
            }
        });

        // Win Rate Chart (Line)
        const winRateCtx = document.getElementById('winrate-chart').getContext('2d');
        this.winRateChart = new Chart(winRateCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'AI Win Rate (%)',
                    data: [],
                    borderColor: 'rgba(34, 211, 238, 1)',
                    backgroundColor: 'rgba(34, 211, 238, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#e2e8f0' }
                    },
                    title: {
                        display: true,
                        text: 'AI Learning Progress',
                        color: '#e2e8f0',
                        font: { size: 14, weight: 'bold' }
                    }
                }
            }
        });
    }

    /**
     * Update charts with current data
     */
    updateCharts() {
        // Update tendency chart
        const tendencies = this.ai.getTendencies();
        this.tendencyChart.data.datasets[0].data = [
            tendencies.rock,
            tendencies.paper,
            tendencies.scissors
        ];
        this.tendencyChart.update();

        // Update win rate chart
        const labels = this.stats.winRateHistory.map((_, i) => i + 1);
        this.winRateChart.data.labels = labels;
        this.winRateChart.data.datasets[0].data = this.stats.winRateHistory;
        this.winRateChart.update();
    }

    /**
     * Update history display
     */
    updateHistoryDisplay() {
        const historyContainer = document.getElementById('history-moves');
        const history = this.ai.getRecentHistory(10);

        historyContainer.innerHTML = history
            .map(move => `<span class="history-move">${this.getMoveEmoji(move)}</span>`)
            .join('');
    }

    /**
     * Update Markov matrix display
     */
    updateMarkovDisplay() {
        const matrix = this.ai.getTransitionMatrix();
        const container = document.getElementById('markov-matrix');

        let html = '<table class="markov-table">';
        html += '<tr><th></th><th>🪨</th><th>📄</th><th>✂️</th></tr>';

        const moves = ['rock', 'paper', 'scissors'];
        const emojis = ['🪨', '📄', '✂️'];

        moves.forEach((from, i) => {
            html += `<tr><th>${emojis[i]}</th>`;
            moves.forEach(to => {
                const prob = matrix[from][to].toFixed(0);
                html += `<td>${prob}%</td>`;
            });
            html += '</tr>';
        });

        html += '</table>';
        container.innerHTML = html;
    }

    /**
     * Update patterns display
     */
    updatePatternsDisplay() {
        const patterns = this.ai.getPatternsSummary();
        const container = document.getElementById('patterns-list');

        if (patterns.length === 0) {
            container.innerHTML = '<p class="no-patterns">No patterns detected yet...</p>';
            return;
        }

        const html = patterns.map(p => {
            const patternStr = p.pattern.split('-').map(m => this.getMoveEmoji(m)).join(' → ');
            return `<div class="pattern-item">${patternStr} (${p.total}x)</div>`;
        }).join('');

        container.innerHTML = html;
    }

    /**
     * Animate result
     */
    animateResult(result) {
        const resultElement = document.getElementById('result-text');
        resultElement.style.animation = 'none';
        setTimeout(() => {
            resultElement.style.animation = 'bounceIn 0.5s ease';
        }, 10);
    }

    /**
     * Reset game
     */
    reset() {
        if (!confirm('Reset all game data? This cannot be undone.')) {
            return;
        }

        this.ai.reset();
        this.stats = {
            playerWins: 0,
            aiWins: 0,
            draws: 0,
            totalGames: 0,
            winRateHistory: []
        };

        // Clear displays
        document.getElementById('player-move').textContent = '❓';
        document.getElementById('ai-move').textContent = '❓';
        document.getElementById('result-text').textContent = 'Make your move!';
        document.getElementById('result-text').className = '';
        document.getElementById('confidence-value').textContent = '0%';
        document.getElementById('confidence-bar').style.width = '0%';

        this.updateUI();
        this.saveStats();
    }

    /**
     * Save stats to localStorage
     */
    saveStats() {
        localStorage.setItem('rps-stats', JSON.stringify(this.stats));
    }

    /**
     * Load stats from localStorage
     */
    loadStats() {
        const saved = localStorage.getItem('rps-stats');
        if (saved) {
            try {
                this.stats = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load stats:', e);
            }
        }
    }
}

// Initialize game when page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new RockPaperScissorsGame();
});
