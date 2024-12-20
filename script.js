const colors = ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF", "#800080", "#000000"];

const colorPalette = document.getElementById('color-palette');
const colorPicker = document.getElementById('color-picker');
const gridSizeInput = document.getElementById('grid-size');
const penButton = document.getElementById('pen');
const pixelCanvas = document.getElementById('pixel-canvas');
const explosionSound = document.getElementById('explosion-sound');
const placeSound = document.getElementById('place-sound');
let selectedColor = colors[0];
let history = [];
let undoneHistory = [];
let isMouseDown = false;
let currentTool = 'pen';

// Function to create grid
function createGrid(size) {
    pixelCanvas.innerHTML = ''; // Clear existing pixels
    pixelCanvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    pixelCanvas.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'pixel';

        pixel.addEventListener('mouseover', () => {
            if (isMouseDown && currentTool === 'pen') {
                applyColor(pixel);
            } else if (isMouseDown && currentTool === 'eraser') {
                eraseColor(pixel);
            }
        });

        pixel.addEventListener('click', () => {
            if (currentTool === 'pen') {
                applyColor(pixel);
            } else if (currentTool === 'eraser') {
                eraseColor(pixel);
            }
        });

        pixelCanvas.appendChild(pixel);
    }

    // Play the explosion sound effect after setting the grid
    explosionSound.play();
}

// Initial grid creation
createGrid(gridSizeInput.value);

// Update grid size when the input changes
gridSizeInput.addEventListener('input', () => {
    createGrid(gridSizeInput.value);
});

// Handle preset colors
document.querySelectorAll('.preset-color').forEach((button, index) => {
    button.addEventListener('click', () => {
        selectedColor = colors[index];
        currentTool = 'pen';
    });
});

// Handle color picker
colorPicker.addEventListener('input', () => {
    selectedColor = colorPicker.value;
    currentTool = 'pen';
});

// Handle canvas events
document.body.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
        isMouseDown = true;
    }
});

document.body.addEventListener('mouseup', () => {
    isMouseDown = false;
});

// Apply color to pixel, save to history, and play sound
function applyColor(pixel) {
    const oldColor = pixel.style.backgroundColor;
    pixel.style.backgroundColor = selectedColor;
    history.push({ pixel, oldColor, newColor: selectedColor });
    undoneHistory = []; // Reset undone history when a new action is taken
    placeSound.play();
}

// Erase color from pixel, save to history, and play sound
function eraseColor(pixel) {
    const oldColor = pixel.style.backgroundColor;
    pixel.style.backgroundColor = '#FFFFFF';
    history.push({ pixel, oldColor, newColor: '#FFFFFF' });
    undoneHistory = []; // Reset undone history when a new action is taken
    placeSound.play();
}

// Eraser functionality
document.getElementById('eraser').addEventListener('click', () => {
    currentTool = 'eraser';
});

// Pen functionality
penButton.addEventListener('click', () => {
    currentTool = 'pen';
});

// Clear All functionality
document.getElementById('clear-all').addEventListener('click', () => {
    const pixels = document.querySelectorAll('.pixel');
    pixels.forEach(pixel => {
        pixel.style.backgroundColor = '#FFFFFF';
    });
    history.push({ type: 'clear' });
    undoneHistory = [];
});

// Undo functionality
document.getElementById('undo').addEventListener('click', () => {
    const lastAction = history.pop();
    if (lastAction) {
        lastAction.pixel.style.backgroundColor = lastAction.oldColor;
        undoneHistory.push(lastAction);
    }
});

// Redo functionality
document.getElementById('redo').addEventListener('click', () => {
    const undoneAction = undoneHistory.pop();
    if (undoneAction) {
        undoneAction.pixel.style.backgroundColor = undoneAction.newColor;
        history.push(undoneAction);
    }
});
