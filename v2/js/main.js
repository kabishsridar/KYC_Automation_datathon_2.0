/**
 * Main Entry Point
 */

window.onload = () => {
    // Initial voice prompt
    setTimeout(() => {
        playVoiceText('welcome');
    }, 1000);

    // Initial Blockchain Credential Hashing Simulation
    setTimeout(() => {
        const badge = document.getElementById('blockchain-status');
        badge.innerHTML = '<span class="material-symbols-outlined">verified</span> CREDENTIALS HASHED';
        badge.classList.remove('pulse');
        badge.style.background = 'rgba(139, 92, 246, 0.2)';
        badge.style.color = '#8b5cf6';
    }, 3000);
};

// PIN auto-submit listener
document.getElementById('send-pin').addEventListener('input', function(e) {
    if (this.value.length === 4) {
        completeSend();
    }
});
