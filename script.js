const listenButton = document.getElementById('listenButton');
const buttonCaption = document.getElementById('buttonCaption');
const listeningText = document.getElementById('listeningText');
const loader = document.querySelector('.loader');

let isListening = false;
let timeoutId;

function startListening() {
    isListening = true;
    buttonCaption.style.display = 'none';
    listeningText.style.display = 'block';
    loader.style.display = 'block';
    
    timeoutId = setTimeout(() => {
        stopListening();
    }, 30000);
}

function stopListening() {
    isListening = false;
    buttonCaption.style.display = 'block';
    listeningText.style.display = 'none';
    loader.style.display = 'none';
    
    clearTimeout(timeoutId);
}

listenButton.addEventListener('click', () => {
    if (isListening) {
        stopListening();
    } else {
        startListening();
    }
});
