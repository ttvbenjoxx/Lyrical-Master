const listenButton = document.getElementById('listenButton');
const buttonCaption = document.getElementById('buttonCaption');
const listeningText = document.getElementById('listeningText');
const loader = document.querySelector('.loader');
const consoleOutput = document.getElementById('consoleOutput');

let isListening = false;
let timeoutId;
let recognition;

function logToConsole(message) {
    consoleOutput.innerText += `\n${message}`;
    consoleOutput.scrollTop = consoleOutput.scrollHeight; // Auto-scroll to the bottom
}

async function requestMicrophoneAccess() {
    try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        logToConsole("Microphone access granted.");
    } catch (error) {
        logToConsole("Microphone access denied.");
        throw error;
    }
}

async function startListening() {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        logToConsole("Speech recognition is not supported in this browser.");
        return;
    }

    try {
        await requestMicrophoneAccess();

        isListening = true;
        buttonCaption.style.display = 'none';
        listeningText.style.display = 'block';
        loader.style.display = 'block';
        logToConsole("Listening...");

        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            logToConsole(`You said: ${transcript}`);
        };

        recognition.onerror = (event) => {
            logToConsole(`Error: ${event.error}`);
            stopListening();
        };

        recognition.onend = () => {
            if (isListening) {
                logToConsole("Speech recognition stopped unexpectedly.");
                stopListening();
            }
        };

        recognition.start();

        timeoutId = setTimeout(() => {
            stopListening();
        }, 30000);

    } catch (error) {
        logToConsole("Failed to start listening. Ensure microphone access is allowed.");
    }
}

function stopListening() {
    if (recognition) {
        recognition.stop();
        recognition = null;
    }

    isListening = false;
    buttonCaption.style.display = 'block';
    listeningText.style.display = 'none';
    loader.style.display = 'none';
    logToConsole("Stopped listening.");
    clearTimeout(timeoutId);
}

listenButton.addEventListener('click', () => {
    if (isListening) {
        stopListening();
    } else {
        startListening();
    }
});
