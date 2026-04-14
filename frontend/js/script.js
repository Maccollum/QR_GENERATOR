// Configuración de partículas
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#00f3ff" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#00ff88",
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            random: true,
            out_mode: "out"
        }
    }
});

// 🔥 URL DE TU BACKEND (Render)
const API_BASE = "https://qr-generator-backend-ump4.onrender.com";

// Variables globales
let currentQRData = '';
let isGenerating = false;

// Elementos DOM
const qrDataInput = document.getElementById('qrData');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrImage = document.getElementById('qrImage');
const dataLength = document.getElementById('dataLength');
const consoleOutput = document.getElementById('consoleOutput');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Frontend inicializado');
    initializeSystem();
    setupEventListeners();
});

function initializeSystem() {
    addConsoleLog('System ready');
    updateDataStats();
}

function setupEventListeners() {
    generateBtn.addEventListener('click', generateQR);
    downloadBtn.addEventListener('click', downloadQR);
    qrDataInput.addEventListener('input', updateDataStats);
}

function updateDataStats() {
    dataLength.textContent = `${qrDataInput.value.length} characters`;
}

// 🔥 GENERAR QR (YA CONECTADO A RENDER)
async function generateQR() {
    const data = qrDataInput.value.trim();

    if (!data) {
        addConsoleLog('ERROR: No data entered', 'error');
        return;
    }

    if (isGenerating) return;
    isGenerating = true;

    generateBtn.disabled = true;
    generateBtn.textContent = 'GENERATING...';
    addConsoleLog('Generating QR from cloud...');

    try {
        const response = await fetch(`${API_BASE}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            qrImage.src = result.image;
            qrImage.style.display = 'block';
            document.querySelector('.placeholder-holo').style.display = 'none';
            currentQRData = data;
            addConsoleLog('SUCCESS: QR generated');
        } else {
            throw new Error(result.error || 'Unknown error');
        }

    } catch (error) {
        addConsoleLog(`ERROR: ${error.message}`, 'error');
    } finally {
        isGenerating = false;
        generateBtn.disabled = false;
        generateBtn.textContent = 'GENERATE QR';
    }

    let data = qrDataInput.value.trim();

    // Forzar formato URL correcto
    if (!data.startsWith("http://") && !data.startsWith("https://")) {
       data = "https://" + data;
   }
}

// 🔥 DESCARGAR QR
function downloadQR() {
    if (!currentQRData) {
        addConsoleLog('ERROR: Generate a QR first', 'error');
        return;
    }

    window.open(
        `${API_BASE}/api/download?data=${encodeURIComponent(currentQRData)}`,
        '_blank'
    );

    addConsoleLog('Download started');
}

// LOGS
function addConsoleLog(message, type = 'info') {
    const log = document.createElement('div');
    log.className = `log-entry ${type}`;
    log.textContent = `> ${message}`;
    consoleOutput.appendChild(log);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// ESTILOS LOG
const style = document.createElement('style');
style.textContent = `
.log-entry.error { color: red; }
.log-entry.success { color: lime; }
`;
document.head.appendChild(style);