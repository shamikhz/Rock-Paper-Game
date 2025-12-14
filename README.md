# 🤖 AI-Powered Rock-Paper-Scissors

An intelligent Rock-Paper-Scissors game where the AI opponent learns your playing patterns and adapts its strategy over time using multiple machine learning techniques.

## 🎮 Features

### Game Features
- **Interactive UI**: Beautiful glassmorphism design with smooth animations
- **Real-time Results**: Instant feedback on wins, losses, and draws
- **Persistent Statistics**: Game data saved in browser localStorage
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### AI/ML Features
The AI uses **four distinct learning strategies** that work together:

1. **Frequency Analysis**
   - Tracks overall distribution of your moves
   - Predicts your most common choice
   - Simple but effective baseline

2. **Markov Chain Prediction**
   - Learns transition probabilities (what you play after each move)
   - Uses conditional probability: P(next move | last move)
   - Adapts to sequential patterns

3. **Pattern Detection**
   - Identifies repeated sequences (length 2-4)
   - Builds a pattern library over time
   - Recognizes complex repeating behaviors

4. **Meta-Strategy Detection**
   - Detects if you're trying to counter the AI
   - Uses mixed strategies when detected
   - Prevents exploitation

### Visualizations
- **Prediction Confidence Meter**: Shows AI's certainty (0-100%)
- **Player Tendencies Chart**: Pie chart of Rock/Paper/Scissors distribution
- **AI Learning Progress**: Line graph showing AI win rate over time
- **Markov Transition Matrix**: Visual probability table
- **Pattern Display**: Shows your most common move sequences
- **Recent History**: Last 10 moves with emoji icons

## 🚀 How to Run

### Option 1: Direct Open (Easiest)
1. Simply open `index.html` in any modern web browser
2. Start playing immediately!

### Option 2: Local Web Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 📁 File Structure

```
rock/
│
├── index.html          # Main game interface
├── style.css           # Premium styling with glassmorphism
├── ai.js              # AI/ML learning system
├── game.js            # Game controller and UI management
└── README.md          # This file
```

## 🧠 How the AI Works

### Learning Process

```
┌─────────────────┐
│  Player Move    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   AI Prediction Engine              │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ 1. Frequency Analysis (20%) │  │
│  │    → Most common move        │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ 2. Markov Chain (40%)       │  │
│  │    → Based on last move      │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ 3. Pattern Detection (30%)  │  │
│  │    → Sequence matching       │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ 4. Meta-Strategy (10%)      │  │
│  │    → Counter-counter logic   │  │
│  └──────────────────────────────┘  │
│                                     │
│         ▼                           │
│   Weighted Prediction               │
│   (Confidence Score)                │
└─────────┬───────────────────────────┘
          │
          ▼
    ┌──────────────┐
    │  AI Counter  │
    │     Move     │
    └──────────────┘
```

### Strategy Weights

The AI combines all predictions using these weights:
- **Frequency**: 20% - Baseline prediction
- **Markov Chain**: 40% - Most reliable for short-term patterns
- **Pattern Detection**: 30% - Catches complex sequences
- **Meta-Strategy**: 10% - Prevents exploitation

### Early Game Behavior

- **First 5 moves**: Random play (not enough data)
- **After 5 moves**: Starts using all strategies
- **After 20+ moves**: AI reaches peak performance

### Confidence Score

The confidence percentage represents:
- **0-40%**: Low confidence, essentially guessing
- **40-70%**: Medium confidence, detected some patterns
- **70-100%**: High confidence, strong pattern recognition

## 🎯 How to Play

1. **Choose Your Move**: Click Rock, Paper, or Scissors
2. **See Results**: Instant feedback on win/lose/draw
3. **Watch AI Learn**: Observe confidence increase over time
4. **Analyze Patterns**: Check visualizations to see what AI learned
5. **Try Different Strategies**: 
   - Play randomly
   - Always pick the same move
   - Use a repeating pattern
   - Try to counter the AI

## 📊 Statistics Explained

### Score Section
- **Your Wins**: Times you beat the AI
- **AI Wins**: Times AI beat you
- **Draws**: Tied rounds
- **Total Games**: Overall rounds played

### Player Tendencies
Shows percentage distribution of your moves:
- Balanced player: ~33% each
- Biased player: One move > 50%

### AI Learning Progress
Line graph showing AI win rate over time:
- Rising line = AI is learning and improving
- Flat line = You're adapting to the AI
- Declining line = You're outsmarting the AI

### Markov Matrix
Shows probability of your next move based on your last move:
- Row = Your last move
- Column = Predicted next move
- Value = Probability percentage

Example:
```
     🪨   📄   ✂️
🪨   20%  50%  30%
📄   40%  30%  30%
✂️   45%  35%  20%
```
After playing Rock, you have 50% chance of playing Paper next.

## 💡 Tips for Testing the AI

### Test Pattern 1: Always Rock
Play Rock 10+ times in a row. Watch:
- Frequency analysis reaches 100% for Rock
- AI starts playing Paper every time
- Confidence approaches 100%

### Test Pattern 2: Rock → Paper → Scissors
Repeat this exact sequence. Watch:
- Pattern detection kicks in around round 6
- AI predicts your next move in the sequence
- Markov chain learns the transitions

### Test Pattern 3: Random Play
Play completely randomly. Watch:
- Confidence stays lower (30-50%)
- AI win rate approaches 33% (random chance)
- All strategies struggle to find patterns

### Test Pattern 4: Counter the AI
Try to guess what AI will play and counter it. Watch:
- Meta-strategy detection activates
- AI switches to mixed strategy
- Counter rate tracked in background

## 🛠️ Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Glassmorphism, animations, responsive design
- **JavaScript (ES6+)**: Game logic and AI algorithms
- **Chart.js**: Data visualization
- **LocalStorage API**: Persistent statistics

## 🔬 AI Implementation Details

### Data Structures

```javascript
// Frequency tracking
moveCounts = { rock: 0, paper: 0, scissors: 0 }

// Markov transitions
transitions = {
    rock: { rock: 0, paper: 0, scissors: 0 },
    paper: { rock: 0, paper: 0, scissors: 0 },
    scissors: { rock: 0, paper: 0, scissors: 0 }
}

// Pattern library (Map structure)
patterns = Map {
    "rock-paper" => { scissors: 5, rock: 2 },
    "paper-scissors" => { rock: 3, paper: 1 },
    ...
}
```

### Prediction Algorithm

```javascript
function predict() {
    // Collect predictions from all strategies
    predictions = {
        frequency: predictByFrequency(),
        markov: predictByMarkov(),
        pattern: predictByPattern(),
        meta: predictByMetaStrategy()
    }
    
    // Calculate weighted scores
    scores = { rock: 0, paper: 0, scissors: 0 }
    
    for each prediction:
        scores[prediction.move] += weight * prediction.confidence
    
    // Return highest scoring move
    return maxScore(scores)
}
```

## 🔮 Future Improvements

### Potential Enhancements
- [ ] Neural network implementation using TensorFlow.js
- [ ] Difficulty levels (Easy, Medium, Hard, Expert)
- [ ] Multiplayer mode (AI vs AI showcase)
- [ ] Export statistics as JSON/CSV
- [ ] Sound effects and music
- [ ] Dark/Light theme toggle
- [ ] Training mode with AI hints
- [ ] Replay system to review past games
- [ ] Advanced visualizations (heatmaps, 3D charts)
- [ ] Tournament mode (best of X rounds)

### Advanced AI Features
- [ ] Long Short-Term Memory (LSTM) for long-term patterns
- [ ] Reinforcement learning (Q-Learning)
- [ ] Genetic algorithm for strategy evolution
- [ ] Time-based pattern detection (weekday vs weekend)
- [ ] Emotional state detection (frustrated player detection)

## 📝 Code Comments

All code files are heavily commented to explain:
- **ai.js**: Each learning strategy with mathematical formulas
- **game.js**: UI updates and game flow
- **index.html**: Structure and element IDs
- **style.css**: Design system and animations

## 🎨 Design Philosophy

- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Vibrant Gradients**: Purple, pink, and cyan color scheme
- **Smooth Animations**: Micro-interactions for enhanced UX
- **Responsive**: Mobile-first approach with grid layouts
- **Dark Theme**: Easy on the eyes for extended play

## 🏆 Challenge Yourself

Can you beat the AI consistently after 50 rounds?

The AI learns from every move. The more you play, the smarter it gets. Try to:
1. Win 60%+ of games after 30 rounds
2. Keep AI confidence below 50% for 20 rounds
3. Find a strategy the AI can't predict

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- **Chart.js** for beautiful data visualizations
- Machine learning concepts from game theory and probability
- Inspired by classic Rock-Paper-Scissors psychology

---

**Enjoy playing against an AI that actually learns!** 🎮🤖
rok-pape.netlify.app
