// AI/ML Learning System for Rock-Paper-Scissors
// Implements multiple prediction strategies that learn from player behavior

class RockPaperScissorsAI {
    constructor() {
        // Player move history
        this.history = [];
        
        // Frequency tracking: count of each move
        this.moveCounts = { rock: 0, paper: 0, scissors: 0 };
        
        // Markov Chain: transition probabilities
        // Tracks what player chooses AFTER each move
        this.transitions = {
            rock: { rock: 0, paper: 0, scissors: 0 },
            paper: { rock: 0, paper: 0, scissors: 0 },
            scissors: { rock: 0, paper: 0, scissors: 0 }
        };
        
        // Pattern detection: store sequences
        this.patterns = new Map();
        
        // Meta-strategy: track how often player counters AI
        this.counterAttempts = 0;
        this.totalMoves = 0;
        
        // AI's prediction confidence (0-100)
        this.lastConfidence = 0;
        
        // AI's last prediction
        this.lastPrediction = null;
    }
    
    /**
     * Record a player move and update all learning models
     * @param {string} playerMove - 'rock', 'paper', or 'scissors'
     */
    learn(playerMove) {
        // Update frequency counts
        this.moveCounts[playerMove]++;
        this.totalMoves++;
        
        // Update Markov chain transitions
        if (this.history.length > 0) {
            const lastMove = this.history[this.history.length - 1];
            this.transitions[lastMove][playerMove]++;
        }
        
        // Update pattern library
        this.updatePatterns(playerMove);
        
        // Check if player is trying to counter the AI
        if (this.lastPrediction && this.wouldCounter(playerMove, this.lastPrediction)) {
            this.counterAttempts++;
        }
        
        // Add to history
        this.history.push(playerMove);
        
        // Keep history manageable (last 100 moves)
        if (this.history.length > 100) {
            this.history.shift();
        }
    }
    
    /**
     * Update pattern detection library
     * Looks for sequences of length 2-4
     */
    updatePatterns(newMove) {
        const minPatternLength = 2;
        const maxPatternLength = 4;
        
        for (let len = minPatternLength; len <= maxPatternLength; len++) {
            if (this.history.length >= len) {
                // Get the pattern (last 'len' moves)
                const pattern = this.history.slice(-len).join('-');
                
                // Store: pattern -> what comes next
                const count = this.patterns.get(pattern) || {};
                count[newMove] = (count[newMove] || 0) + 1;
                this.patterns.set(pattern, count);
            }
        }
    }
    
    /**
     * Predict player's next move using all strategies
     * @returns {string} - predicted move ('rock', 'paper', or 'scissors')
     */
    predict() {
        // Early game: not enough data, use random
        if (this.totalMoves < 5) {
            this.lastConfidence = 33;
            return this.randomMove();
        }
        
        // Collect predictions from all strategies
        const predictions = {
            frequency: this.predictByFrequency(),
            markov: this.predictByMarkov(),
            pattern: this.predictByPattern(),
            meta: this.predictByMetaStrategy()
        };
        
        // Weight each prediction method
        const weights = {
            frequency: 0.2,
            markov: 0.4,
            pattern: 0.3,
            meta: 0.1
        };
        
        // Calculate weighted prediction
        const scores = { rock: 0, paper: 0, scissors: 0 };
        
        for (const [method, prediction] of Object.entries(predictions)) {
            if (prediction.move) {
                scores[prediction.move] += weights[method] * prediction.confidence;
            }
        }
        
        // Find highest scoring prediction
        let bestMove = 'rock';
        let bestScore = 0;
        
        for (const [move, score] of Object.entries(scores)) {
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        
        // Calculate overall confidence (0-100)
        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
        this.lastConfidence = totalScore > 0 ? Math.min(100, (bestScore / totalScore) * 100) : 33;
        
        this.lastPrediction = bestMove;
        return bestMove;
    }
    
    /**
     * Frequency-based prediction
     * Predicts the player's most common move
     */
    predictByFrequency() {
        const total = this.totalMoves;
        if (total === 0) return { move: null, confidence: 0 };
        
        let maxCount = 0;
        let predictedMove = 'rock';
        
        for (const [move, count] of Object.entries(this.moveCounts)) {
            if (count > maxCount) {
                maxCount = count;
                predictedMove = move;
            }
        }
        
        const confidence = (maxCount / total) * 100;
        return { move: predictedMove, confidence };
    }
    
    /**
     * Markov Chain prediction
     * Predicts based on what player usually does after their last move
     */
    predictByMarkov() {
        if (this.history.length === 0) return { move: null, confidence: 0 };
        
        const lastMove = this.history[this.history.length - 1];
        const nextMoves = this.transitions[lastMove];
        
        const total = Object.values(nextMoves).reduce((a, b) => a + b, 0);
        if (total === 0) return { move: null, confidence: 0 };
        
        let maxCount = 0;
        let predictedMove = 'rock';
        
        for (const [move, count] of Object.entries(nextMoves)) {
            if (count > maxCount) {
                maxCount = count;
                predictedMove = move;
            }
        }
        
        const confidence = (maxCount / total) * 100;
        return { move: predictedMove, confidence };
    }
    
    /**
     * Pattern-based prediction
     * Looks for repeated sequences in recent history
     */
    predictByPattern() {
        if (this.history.length < 2) return { move: null, confidence: 0 };
        
        // Try different pattern lengths, prefer longer patterns
        for (let len = 4; len >= 2; len--) {
            if (this.history.length >= len) {
                const currentPattern = this.history.slice(-len).join('-');
                const nextMoves = this.patterns.get(currentPattern);
                
                if (nextMoves) {
                    const total = Object.values(nextMoves).reduce((a, b) => a + b, 0);
                    let maxCount = 0;
                    let predictedMove = 'rock';
                    
                    for (const [move, count] of Object.entries(nextMoves)) {
                        if (count > maxCount) {
                            maxCount = count;
                            predictedMove = move;
                        }
                    }
                    
                    const confidence = (maxCount / total) * 100;
                    return { move: predictedMove, confidence };
                }
            }
        }
        
        return { move: null, confidence: 0 };
    }
    
    /**
     * Meta-strategy prediction
     * Detects if player is trying to counter the AI's previous moves
     */
    predictByMetaStrategy() {
        if (this.totalMoves < 10) return { move: null, confidence: 0 };
        
        const counterRate = this.counterAttempts / this.totalMoves;
        
        // If player frequently tries to counter, predict counter-counter
        if (counterRate > 0.6) {
            // Player is likely trying to beat what they think AI will play
            // Use a mixed strategy
            const rand = Math.random();
            const predictedMove = rand < 0.33 ? 'rock' : rand < 0.66 ? 'paper' : 'scissors';
            return { move: predictedMove, confidence: 50 };
        }
        
        return { move: null, confidence: 0 };
    }
    
    /**
     * Get AI's move (counters the prediction)
     * @returns {string} - AI's chosen move
     */
    getMove() {
        const prediction = this.predict();
        return this.counterMove(prediction);
    }
    
    /**
     * Get the move that beats the predicted move
     */
    counterMove(move) {
        const counters = {
            rock: 'paper',      // Paper beats rock
            paper: 'scissors',  // Scissors beats paper
            scissors: 'rock'    // Rock beats scissors
        };
        return counters[move];
    }
    
    /**
     * Check if playerMove would counter aiPrediction
     */
    wouldCounter(playerMove, aiPrediction) {
        return this.counterMove(aiPrediction) === playerMove;
    }
    
    /**
     * Get a random move
     */
    randomMove() {
        const moves = ['rock', 'paper', 'scissors'];
        return moves[Math.floor(Math.random() * moves.length)];
    }
    
    /**
     * Get player tendency percentages
     */
    getTendencies() {
        if (this.totalMoves === 0) {
            return { rock: 33.33, paper: 33.33, scissors: 33.33 };
        }
        
        return {
            rock: (this.moveCounts.rock / this.totalMoves) * 100,
            paper: (this.moveCounts.paper / this.totalMoves) * 100,
            scissors: (this.moveCounts.scissors / this.totalMoves) * 100
        };
    }
    
    /**
     * Get Markov transition matrix for visualization
     */
    getTransitionMatrix() {
        const matrix = {};
        
        for (const [from, transitions] of Object.entries(this.transitions)) {
            matrix[from] = {};
            const total = Object.values(transitions).reduce((a, b) => a + b, 0);
            
            for (const [to, count] of Object.entries(transitions)) {
                matrix[from][to] = total > 0 ? (count / total) * 100 : 0;
            }
        }
        
        return matrix;
    }
    
    /**
     * Get detected patterns summary
     */
    getPatternsSummary() {
        const summary = [];
        
        // Get top 5 most common patterns
        const patternArray = Array.from(this.patterns.entries())
            .map(([pattern, nextMoves]) => {
                const total = Object.values(nextMoves).reduce((a, b) => a + b, 0);
                return { pattern, nextMoves, total };
            })
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);
        
        return patternArray;
    }
    
    /**
     * Get last prediction confidence
     */
    getConfidence() {
        return Math.round(this.lastConfidence);
    }
    
    /**
     * Get recent history (last n moves)
     */
    getRecentHistory(n = 10) {
        return this.history.slice(-n);
    }
    
    /**
     * Reset all learning data
     */
    reset() {
        this.history = [];
        this.moveCounts = { rock: 0, paper: 0, scissors: 0 };
        this.transitions = {
            rock: { rock: 0, paper: 0, scissors: 0 },
            paper: { rock: 0, paper: 0, scissors: 0 },
            scissors: { rock: 0, paper: 0, scissors: 0 }
        };
        this.patterns.clear();
        this.counterAttempts = 0;
        this.totalMoves = 0;
        this.lastConfidence = 0;
        this.lastPrediction = null;
    }
}
