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
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
        }
    }
});

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
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Frontend 2050 inicializado');
    initializeSystem();
    setupEventListeners();
});

function initializeSystem() {
    addConsoleLog('System boot sequence initiated...');
    addConsoleLog('Quantum processors online');
    addConsoleLog('Ready for quantum data processing');
    updateDataStats();
}

function setupEventListeners() {
    generateBtn.addEventListener('click', generateQR);
    downloadBtn.addEventListener('click', downloadQR);
    qrDataInput.addEventListener('input', updateDataStats);
}

function updateDataStats() {
    const length = qrDataInput.value.length;
    dataLength.textContent = `${length} quantum bytes`;
}

async function generateQR() {
    console.log('🎯 TEST: Iniciando generación de QR');
    
    const data = qrDataInput.value.trim();
    console.log('📝 Datos a enviar:', data);
    
    if (!data) {
        addConsoleLog('ERROR: No data entered', 'error');
        return;
    }
    
    if (isGenerating) return;
    isGenerating = true;
    
    generateBtn.disabled = true;
    generateBtn.textContent = 'GENERATING...';
    addConsoleLog('Sending quantum data to matrix...');
    
    try {
        console.log('🌐 Enviando request a: http://127.0.0.1:5000/api/generate');
        
        const response = await fetch('http://127.0.0.1:5000/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: data })
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error response:', errorText);
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('✅ Response data:', result);
        
        if (result.success) {
            qrImage.src = result.image;
            qrImage.style.display = 'block';
            document.querySelector('.placeholder-holo').style.display = 'none';
            currentQRData = data;
            addConsoleLog('SUCCESS: Quantum matrix generated');
            console.log('🎉 QR generado y mostrado');
        } else {
            throw new Error(result.error || 'Unknown server error');
        }
        
    } catch (error) {
        console.error('❌ Error completo:', error);
        addConsoleLog(`ERROR: ${error.message}`, 'error');
    } finally {
        isGenerating = false;
        generateBtn.disabled = false;
        generateBtn.textContent = 'GENERATE QUANTUM CODE';
        console.log('🔄 Estado resetado');
    }
}

async function downloadQR() {
    if (!currentQRData) {
        addConsoleLog('ERROR: Generate a QR first', 'error');
        return;
    }
    
    try {
        window.open(
            `http://127.0.0.1:5000/api/download?data=${encodeURIComponent(currentQRData)}`,
            '_blank'
        );
        addConsoleLog('SUCCESS: Download initiated');
    } catch (error) {
        addConsoleLog(`DOWNLOAD ERROR: ${error.message}`, 'error');
    }
}

function addConsoleLog(message, type = 'info') {
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.textContent = `> ${message}`;
    consoleOutput.appendChild(logEntry);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// CSS para logs
const style = document.createElement('style');
style.textContent = `
    .log-entry.error { color: #ff4444; }
    .log-entry.success { color: #00ff88; }
`;
document.head.appendChild(style);
