const tempElement = document.getElementById('temp');
const resultElement = document.getElementById('result');
const externalTempElement = document.getElementById('external-temp-value');
const serverBar = document.getElementById('server-bar-inner');
const externalBar = document.getElementById('external-bar-inner');
const accuracyElement = document.getElementById('accuracy');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const closeModal = document.getElementsByClassName('close')[0];

let temperature = Math.floor(Math.random() * 6) + 22;
let externalTemperature = Math.floor(Math.random() * 16) + 20;
let inRangeTime = 0;
let totalTime = 0;
let interval;

const gameDuration = 90;

const startButton = document.getElementById('start-button');

let gameStarted = false;

function startGame() {
    gameStarted = true;
    startButton.textContent = "온도 조절 중";
    startButton.disabled = true;

    interval = setInterval(() => {
        updateExternalTemperature();
        checkTemperature();
        updateAccuracy();
    }, 500);
}

startButton.addEventListener('click', () => {
    if (!gameStarted) {
        startGame();
    }
});

function updateTemperature(change) {
    temperature += change;
    if (temperature < 15) temperature = 15;
    if (temperature > 50) temperature = 50;

    temperature = Math.round(temperature * 10) / 10;

    tempElement.textContent = temperature;
    serverBar.style.width = `${((temperature - 15) * 100) / 35}%`;
}

function updateExternalTemperature() {
    const drift = Math.random() < 0.5 ? -3 : 3;
    externalTemperature += drift;

    if (externalTemperature < 10) externalTemperature = 10;
    if (externalTemperature > 50) externalTemperature = 50;

    externalTemperature = Math.round(externalTemperature * 10) / 10;

    externalTempElement.textContent = externalTemperature;
    externalBar.style.width = `${((externalTemperature - 10) * 100) / 40}%`;
}

const alertPopup = document.getElementById('alert-popup');
const alertMessage = document.getElementById('alert-message');

function updateAccuracy() {
    const diff = Math.abs(temperature - externalTemperature);

    let accuracy = Math.max(0, 100 - (diff * 4.5));

    accuracy = Math.round(accuracy * 10) / 10;

    if (accuracy > 80) {
        resultElement.textContent = "상태: Safe";
        resultElement.style.color = "lightgreen";
        hideAlert();
    } else if (accuracy > 70) {
        resultElement.textContent = "상태: Warning";
        resultElement.style.color = "orange";
        showAlert("Warning: 정확도가 낮습니다.");
    } else {
        resultElement.textContent = "상태: Danger";
        resultElement.style.color = "red";
        showAlert("Danger: 정확도가 매우 낮습니다.");
    }

    accuracyElement.textContent = `정확도 : ${accuracy}%`;

    return accuracy;
}

function showAlert(message) {
    alertPopup.style.display = "block";
    alertMessage.textContent = message;

    setTimeout(() => {
        alertPopup.style.display = "none";
    }, 3000);
}

function hideAlert() {
    alertPopup.style.display = "none";
}

function checkTemperature() {
    totalTime++;
    let adjustedTemperature = temperature + (externalTemperature - temperature) * 0.1;
    temperature = adjustedTemperature;

    if (adjustedTemperature >= 15 && adjustedTemperature <= 50) {
        inRangeTime++;
    }

    const accuracy = updateAccuracy();

    if (totalTime >= gameDuration) {
        clearInterval(interval);

        if (accuracy >= 80) {
            showModal('서버실 내부 온도 조절에 성공 했습니다 : Password > VIRUS123@!', 'lightgreen');
        } else {
            showModal('서버실 내부 온도 조절에 실패 했습니다 : 정확도가 80% 보다 낮습니다.', 'red');
        }
    }
}

function showModal(message, color) {
    modalMessage.textContent = message;
    modalMessage.style.color = color;
    modal.style.display = "block";
}

closeModal.onclick = function() {
    modal.style.display = "none";
}

document.addEventListener('keydown', (event) => {
    if (!gameStarted == false) {
        if (event.key === 'w' || event.key === 'W') {
            updateTemperature(1);
        } else if (event.key === 's' || event.key === 'S') {
            updateTemperature(-1);
        }
    }
});
