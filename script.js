// 🧠 Welcome to MemoryGame - where cards play hide and seek with your brain!
class MemoryGame {
    constructor() {
        // 🎯 Setting up our game's state (like preparing for a card party)
        this.words = [];          // Our vocabulary for the day
        this.emojis = [];         // Our emoji friends joining the party
        this.cards = [];          // The party guests (they come in pairs)
        this.flippedCards = [];   // Cards doing gymnastics
        this.matchedPairs = 0;    // Love connections made
        this.moves = 0;           // How many times you've played cupid
        this.isLocked = false;    // When cards need a moment to think

        this.initializeEventListeners();
    }

    // 👂 Teaching our game to respond to your commands (like a well-trained puppy)
    initializeEventListeners() {
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        document.getElementById('new-game').addEventListener('click', () => this.resetGame());
        
        // 🎨 Setup emoji inputs
        document.querySelectorAll('.emoji-input').forEach(input => {
            input.addEventListener('click', () => {
                input.select();  // Select all text when clicked
            });
            
            input.addEventListener('input', (e) => {
                // Get the last character if multiple characters are pasted
                const lastChar = [...e.target.value].pop();
                // Check if it's an emoji (basic check for non-ASCII characters)
                if (lastChar && /\p{Extended_Pictographic}/u.test(lastChar)) {
                    e.target.value = lastChar;
                } else if (!e.target.value.trim()) {
                    e.target.value = '🎨'; // Default emoji if cleared
                }
            });
        });
    }

    // 🎬 Lights, Camera, Action! Time to start the memory magic
    startGame() {
        // 📝 Collecting words and emojis like Pokemon
        const wordInputs = document.querySelectorAll('.word-input');
        const emojiInputs = document.querySelectorAll('.emoji-input');
        
        this.words = Array.from(wordInputs).map(input => input.value.trim());
        this.emojis = Array.from(emojiInputs).map(input => {
            const emoji = input.value.trim();
            return emoji === '🎨' ? '🎴' : emoji; // Use default card emoji if unchanged
        });

        // 🕵️ Making sure no word is left behind
        if (this.words.some(word => word === '')) {
            alert('Please fill in all words!');
            return;
        }

        // 🎭 Time for the grand stage transformation
        document.querySelector('.input-section').style.display = 'none';
        document.querySelector('.game-board').style.display = 'block';

        this.initializeCards();
        this.renderCards();
    }

    // 🃏 Creating our cast of card characters
    initializeCards() {
        // 👯‍♂️ Making twins of each word-emoji pair (because good things come in pairs)
        this.cards = this.words.map((word, index) => ({
            id: index,
            word: word,
            emoji: this.emojis[index],
            isFlipped: false,   // Not doing backflips yet
            isMatched: false    // Still single and ready to mingle
        }));
        
        // Double the cards for pairs
        this.cards = [...this.cards, ...this.cards.map(card => ({...card}))];

        // 🎲 Shuffle shuffle! (Like a Vegas dealer with style)
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    // 🎨 Painting our masterpiece of cards
    renderCards() {
        const grid = document.querySelector('.cards-grid');
        grid.innerHTML = '';

        // 🔤 Giving each card its fancy name tag (A through P)
        const indicators = Array.from({ length: 16 }, (_, i) => 
            String.fromCharCode(65 + i));

        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.innerHTML = `
                <div class="card-front">
                    <div class="card-content">
                        <div class="card-emoji">🎴</div>
                    </div>
                    <div class="card-indicator">${indicators[index]}</div>
                </div>
                <div class="card-back">
                    <div class="card-content">
                        <div class="card-emoji">${card.emoji}</div>
                        <div class="card-word">${card.word}</div>
                    </div>
                    <div class="card-indicator">${indicators[index]}</div>
                </div>
            `;
            cardElement.addEventListener('click', () => this.flipCard(card, cardElement));
            grid.appendChild(cardElement);
        });
    }

    // 🔄 The moment when a card reveals its secret identity
    flipCard(card, element) {
        if (this.isLocked || card.isFlipped || card.isMatched) return;

        // 🎭 Time for the dramatic reveal
        card.isFlipped = true;
        element.classList.add('flipped');
        this.flippedCards.push({ card, element });

        // 👀 Checking if we've found true love (a matching pair)
        if (this.flippedCards.length === 2) {
            this.moves++;
            document.querySelector('.moves').textContent = `Moves: ${this.moves}`;
            this.isLocked = true;

            const [first, second] = this.flippedCards;
            if (first.card.word === second.card.word) {
                // 💘 A perfect match! (Like peanut butter and jelly)
                first.card.isMatched = second.card.isMatched = true;
                this.matchedPairs++;
                document.querySelector('.pairs').textContent = `Pairs Found: ${this.matchedPairs}/8`;
                this.flippedCards = [];
                this.isLocked = false;

                if (this.matchedPairs === 8) {
                    // 🎉 Victory dance time!
                    setTimeout(() => {
                        alert(`Congratulations! You won in ${this.moves} moves!`);
                    }, 500);
                }
            } else {
                // 💔 Not a match (like pineapple on pizza - controversial)
                setTimeout(() => {
                    first.element.classList.remove('flipped');
                    second.element.classList.remove('flipped');
                    first.card.isFlipped = second.card.isFlipped = false;
                    this.flippedCards = [];
                    this.isLocked = false;
                }, 1000);
            }
        }
    }

    // 🔄 The "oops let's start over" button (because everyone deserves a second chance)
    resetGame() {
        // 🧹 Spring cleaning for our game state
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.isLocked = false;

        // 📋 Resetting the scoreboard (back to square one)
        document.querySelector('.moves').textContent = 'Moves: 0';
        document.querySelector('.pairs').textContent = 'Pairs Found: 0/8';
        document.querySelector('.input-section').style.display = 'block';
        document.querySelector('.game-board').style.display = 'none';

        // 🧼 Wiping the slate clean
        document.querySelectorAll('.word-input').forEach(input => input.value = '');
        document.querySelectorAll('.emoji-input').forEach(input => input.value = '');
    }
}

// 🎮 Let the memory games begin! (May the odds be ever in your favor)
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});
