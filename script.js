// Google Sheets Integration
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyVtyPTRyznzcf06DdmNbsgIxPeFIidUFtCVf4ZyIlR0yHk5kvqjVHAaR_1lvfrEGhiJA/exec';

// Animation elements
const character = document.getElementById('character');
const bottleInHand = document.getElementById('bottleInHand');
const coconutWater = document.getElementById('coconutWater');
const coconutMalai = document.getElementById('coconutMalai');
const bottleBottom = document.getElementById('bottleBottom');
const bubbles = [
    document.getElementById('bubble1'),
    document.getElementById('bubble2'),
    document.getElementById('bubble3')
];

// Control buttons
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

// Animation state
let animationInProgress = false;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cocofresh landing page loaded successfully!');
    
    // Initialize animation controls
    restartBtn.disabled = true;
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize bottle liquid levels
    coconutWater.style.height = '100%';
    coconutMalai.style.height = '100%';
});

// Set up all event listeners
function setupEventListeners() {
    // Animation controls
    startBtn.addEventListener('click', startAnimation);
    restartBtn.addEventListener('click', restartAnimation);
    
    // Form submission
    document.getElementById('waitlistForm').addEventListener('submit', handleFormSubmit);
    
    // Response viewer button
    document.getElementById('responseViewerBtn').addEventListener('click', showResponses);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation functions
function startAnimation() {
    if (animationInProgress) return;
    
    animationInProgress = true;
    startBtn.disabled = true;
    restartBtn.disabled = true;
    
    resetAnimation();
    
    // Step 1: Show character and bottle in hand
    setTimeout(() => {
        character.style.opacity = '1';
        bottleInHand.style.opacity = '1';
        
        // Step 2: Twist the bottom compartment
        setTimeout(() => {
            bottleBottom.style.transform = 'rotate(-30deg)';
            
            // Step 3: Start drinking animation
            setTimeout(() => {
                let waterHeight = 100;
                const drinkWater = setInterval(() => {
                    waterHeight -= 3;
                    coconutWater.style.height = `${waterHeight}%`;
                    
                    // Show bubbles occasionally
                    if (waterHeight % 20 === 0) {
                        showBubbles();
                    }
                    
                    if (waterHeight <= 0) {
                        clearInterval(drinkWater);
                        
                        // Animation complete
                        setTimeout(() => {
                            animationInProgress = false;
                            restartBtn.disabled = false;
                        }, 1000);
                    }
                }, 100);
            }, 1000);
        }, 1000);
    }, 500);
}

function resetAnimation() {
    character.style.opacity = '0';
    bottleInHand.style.opacity = '0';
    bottleBottom.style.transform = 'rotate(0deg)';
    coconutWater.style.height = '100%';
    coconutMalai.style.height = '100%';
    
    bubbles.forEach(bubble => {
        bubble.style.opacity = '0';
    });
}

function restartAnimation() {
    resetAnimation();
    setTimeout(startAnimation, 500);
}

function showBubbles() {
    bubbles.forEach((bubble, index) => {
        const size = Math.random() * 15 + 5;
        const left = Math.random() * 100;
        const bottom = Math.random() * 50 + 20;
        
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}%`;
        bubble.style.bottom = `${bottom}%`;
        bubble.style.opacity = '0.8';
        
        // Animate bubble rising
        bubble.animate([
            { bottom: `${bottom}%`, opacity: 0.8 },
            { bottom: `${bottom + 30}%`, opacity: 0 }
        ], {
            duration: 1000,
            delay: index * 200
        });
        
        // Reset bubble after animation
        setTimeout(() => {
            bubble.style.opacity = '0';
        }, 1000 + index * 200);
    });
}

// Form handling functions
function handleFormSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Show loading state
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Save to Google Sheets
    fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            timestamp: new Date().toISOString(),
            source: 'cocofresh-landing'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success message
            document.getElementById('thankYouMessage').style.display = 'block';
            document.getElementById('waitlistForm').reset();
            console.log('✅ Response saved to Google Sheets');
            
            // Also save to localStorage as backup
            saveToLocalStorage(email);
        } else {
            throw new Error(data.error || 'Failed to save to Google Sheets');
        }
    })
    .catch(error => {
        console.error('Google Sheets Error:', error);
        // Fallback to localStorage only
        saveToLocalStorage(email);
        document.getElementById('thankYouMessage').style.display = 'block';
        document.getElementById('waitlistForm').reset();
        alert('Thank you! Your response has been recorded.');
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function saveToLocalStorage(email) {
    const responses = JSON.parse(localStorage.getItem('cocofreshResponses') || '[]');
    responses.push({
        email: email,
        timestamp: new Date().toISOString(),
        source: 'cocofresh-landing'
    });
    localStorage.setItem('cocofreshResponses', JSON.stringify(responses));
    console.log('📊 Response saved to localStorage. Total:', responses.length);
}

function showResponses() {
    const responses = JSON.parse(localStorage.getItem('cocofreshResponses') || '[]');
    
    if (responses.length === 0) {
        alert('No responses yet. Try submitting the form first.');
        return;
    }
    
    let message = `📊 COCOFRESH RESPONSES (${responses.length} total)\n\n`;
    
    responses.forEach((response, index) => {
        message += `${index + 1}. ${response.email}\n   📅 ${new Date(response.timestamp).toLocaleString()}\n\n`;
    });
    
    alert(message);
}

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function scrollToWaitlist() {
    document.getElementById('waitlist').scrollIntoView({
        behavior: 'smooth'
    });
}
