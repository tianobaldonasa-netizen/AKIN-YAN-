const messages = [
    "Hi Bubbles... ❤️",
    "I have something special to tell you...",
    "Are you ready?",
    "Click the button below! ✨"
];

let messageIndex = 0;
let charIndex = 0;
const typewriterElement = document.getElementById('typewriter');
const buttonElement = document.getElementById('openLetterBtn');
const modalElement = document.getElementById('letterModal');
const closeBtn = document.getElementById('closeBtn');

function typeWriter() {
    if (messageIndex < messages.length) {
        if (charIndex < messages[messageIndex].length) {
            typewriterElement.textContent += messages[messageIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 100);
        } else {
            setTimeout(eraseText, 1500); // Wait before erasing
        }
    } else {
        // Finished typing all messages
        typewriterElement.innerHTML = "I Love You, Bubbles! ❤️";
        buttonElement.classList.remove('hidden');
        createHearts(); // Start floating hearts
    }
}

function eraseText() {
    if (messageIndex < messages.length - 1) {
        if (charIndex > 0) {
            typewriterElement.textContent = messages[messageIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(eraseText, 50);
        } else {
            messageIndex++;
            setTimeout(typeWriter, 500);
        }
    } else {
        // Last message reached, don't erase, just show button
        messageIndex++;
        typeWriter();
    }
}

// Start the animation
setTimeout(typeWriter, 1000);

// Modal and Tree Logic
let isLetterTyped = false;

const longLetterText = `Every single day with you feels like a beautiful dream I never want to wake up from. You are my sunshine on the cloudiest days, my peace in the chaos, and my greatest adventure.

I love the way your smile lights up a room, and the way your laugh makes everything okay. You are so incredibly special to me, and I want to spend the rest of my days making you feel as loved and cherished as you truly are.

Thank you for being you, for being mine, and for making my world so much brighter. I love you more than words could ever express, today, tomorrow, and always.`;

let letterCharIndex = 0;
const letterElement = document.getElementById('letterText');
const signatureElement = document.getElementById('signature');

function typeLetter() {
    if (letterCharIndex < longLetterText.length) {
        let char = longLetterText.charAt(letterCharIndex);
        if (char === '\n') {
            letterElement.innerHTML += '<br>';
        } else {
            letterElement.innerHTML += char;
        }
        letterCharIndex++;
        
        // Auto scroll down as it types
        const letterContent = document.querySelector('.letter-content');
        letterContent.scrollTop = letterContent.scrollHeight;
        
        // Random typing speed
        setTimeout(typeLetter, Math.random() * 30 + 30);
    } else {
        signatureElement.classList.remove('hidden');
    }
}

buttonElement.addEventListener('click', () => {
    // Hide main card
    document.getElementById('mainCard').classList.add('hidden');
    
    // Show Tree Canvas and start tree growth
    const treeCanvas = document.getElementById('treeCanvas');
    treeCanvas.classList.add('show');
    initTree();
    
    // Show Modal
    modalElement.classList.remove('hidden');
    
    // Start letter typing
    if (!isLetterTyped) {
        letterElement.innerHTML = '';
        setTimeout(typeLetter, 800); // Wait for modal to fade in
        isLetterTyped = true;
    }
});

closeBtn.addEventListener('click', () => {
    modalElement.classList.add('hidden');
    document.getElementById('mainCard').classList.remove('hidden');
    // Hide tree canvas again (optional)
    document.getElementById('treeCanvas').classList.remove('show');
    // We could reset the tree here, but let's just hide it
});

// Heart animation for the intro
function createHearts() {
    const heartsContainer = document.getElementById('heartsContainer');
    
    const interval = setInterval(() => {
        // Stop intro hearts if modal is opened to let the tree take over
        if (!modalElement.classList.contains('hidden')) {
            clearInterval(interval);
            heartsContainer.innerHTML = ''; // clear them
            return;
        }

        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '100vh';
        
        const size = Math.random() * 20 + 10; 
        heart.style.fontSize = size + 'px';
        
        heart.style.animationDuration = Math.random() * 3 + 3 + 's';
        
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode === heartsContainer) {
                heart.remove();
            }
        }, 6000);
    }, 300);
}

// ----------------------------------------------------
// BEAUTIFUL HEART TREE GENERATOR (CANVAS)
// ----------------------------------------------------

const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let branches = [];
let leaves = []; // Hearts
let growing = false;

function initTree() {
    branches = [];
    leaves = [];
    
    const isMobile = window.innerWidth <= 768;
    const startX = isMobile ? canvas.width / 2 : canvas.width * 0.75;
    const startY = canvas.height;
    const treeHeight = isMobile ? Math.min(canvas.height / 3, 150) : Math.min(canvas.height / 3, 250);
    
    // Initial branch starts from bottom
    branches.push(new Branch(startX, startY, -Math.PI / 2, treeHeight, 15));
    growing = true;
    requestAnimationFrame(animateTree);
}

class Branch {
    constructor(x, y, angle, length, width) {
        this.startX = x;
        this.startY = y;
        this.angle = angle;
        this.targetLength = length;
        this.width = width;
        this.currentLength = 0;
        this.finished = false;
        this.children = [];
        this.hasSpawned = false;
        
        this.endX = this.startX + Math.cos(this.angle) * this.currentLength;
        this.endY = this.startY + Math.sin(this.angle) * this.currentLength;
    }
    
    update() {
        if (this.currentLength < this.targetLength) {
            this.currentLength += 3; // branch growth speed
            this.endX = this.startX + Math.cos(this.angle) * this.currentLength;
            this.endY = this.startY + Math.sin(this.angle) * this.currentLength;
        } else if (!this.hasSpawned) {
            this.finished = true;
            this.hasSpawned = true;
            
            // Spawn children or leaves
            if (this.width > 2) { 
                // continue branching
                const numBranches = Math.random() > 0.5 ? 2 : 3;
                for (let i = 0; i < numBranches; i++) {
                    const dir = (i % 2 === 0) ? 1 : -1;
                    const angleOffset = dir * (Math.random() * 0.4 + 0.15); // Spread of branches
                    const newLen = this.targetLength * (Math.random() * 0.3 + 0.6); // new length
                    this.children.push(new Branch(this.endX, this.endY, this.angle + angleOffset, newLen, this.width * 0.7));
                }
            } else {
                // branch is thin enough, spawn hearts!
                for(let i = 0; i < 4; i++) {
                    leaves.push(new HeartLeaf(this.endX, this.endY));
                }
            }
        }
        
        for (let child of this.children) {
            child.update();
        }
    }
    
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        // Wood color that blends well with dark theme
        ctx.strokeStyle = `rgba(80, 40, 40, 0.9)`; 
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        for (let child of this.children) {
            child.draw();
        }
    }
}

class HeartLeaf {
    constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * 30;
        this.y = y + (Math.random() - 0.5) * 30;
        this.size = Math.random() * 4 + 4; // size of heart
        
        // Random pinks, reds, whites
        const hue = 340 + Math.random() * 30;
        this.color = `hsl(${hue}, 100%, 75%)`; 
        
        this.scale = 0; // starts at 0 and blooms
        this.falling = false;
        
        // wind and gravity
        this.fallSpeedY = Math.random() * 1 + 0.5;
        this.fallSpeedX = (Math.random() - 0.5) * 1.5;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.05;
    }
    
    update() {
        // Bloom
        if (this.scale < 1 && !this.falling) {
            this.scale += 0.02;
        }
        
        // Randomly decide to fall after blooming
        if (this.scale >= 1 && !this.falling && Math.random() < 0.0005) {
            this.falling = true;
        }
        
        // Fall
        if (this.falling) {
            this.y += this.fallSpeedY;
            this.x += this.fallSpeedX;
            this.angle += this.spin;
        }
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.scale(this.scale, this.scale);
        
        // Draw Heart Path
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(0, -this.size / 2, -this.size, -this.size / 2, -this.size, this.size / 4);
        ctx.bezierCurveTo(-this.size, this.size, 0, this.size * 1.5, 0, this.size * 2);
        ctx.bezierCurveTo(0, this.size * 1.5, this.size, this.size, this.size, this.size / 4);
        ctx.bezierCurveTo(this.size, -this.size / 2, 0, -this.size / 2, 0, 0);
        ctx.fill();
        
        ctx.restore();
    }
}

function animateTree() {
    if (!growing) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw and update all branches
    for (let branch of branches) {
        branch.update();
        branch.draw();
    }
    
    // Draw and update all leaves
    for (let leaf of leaves) {
        leaf.update();
        leaf.draw();
    }
    
    requestAnimationFrame(animateTree);
}
