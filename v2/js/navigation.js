/**
 * Routing & Navigation Module
 */

function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function switchStep(flow, stepNum) {
    const parentId = flow === 'send' ? 'screen-send-money' : 'screen-deposit';
    document.querySelectorAll(`#${parentId} .step`).forEach(s => s.classList.remove('active'));
    const targetId = `${flow}-step-${stepNum}`;
    document.getElementById(targetId).classList.add('active');
}

function goHome() {
    switchScreen('screen-home');
    playVoiceText('welcome');
}
