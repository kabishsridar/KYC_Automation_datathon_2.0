/**
 * Blockchain Ledger Simulation Module
 */

function simulateLedgerSync(callback) {
    switchStep('send', 'ledger');
    document.getElementById('voice-text').textContent = (currentLang === 'ta') ? "பிளாக்செயினில் சரிபார்க்கிறது..." : "Verifying on Blockchain...";
    
    let progress = 0;
    const bar = document.getElementById('ledger-progress');
    const hashText = document.getElementById('current-hash');
    const nodes = document.querySelectorAll('.node');
    
    const interval = setInterval(() => {
        progress += 2;
        bar.style.width = progress + '%';
        
        hashText.textContent = '0x' + Math.random().toString(16).substr(2, 8) + '...' + Math.random().toString(16).substr(2, 4);
        
        if (progress > 30) nodes[0].classList.add('active');
        if (progress > 60) nodes[1].classList.add('active');
        if (progress > 90) nodes[2].classList.add('active');

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                nodes.forEach(n => n.classList.remove('active'));
                callback();
            }, 500);
        }
    }, 50);
}

function generateFinalHash() {
    return '0x' + Math.random().toString(16).substr(2, 6).toUpperCase() + '...' + Math.random().toString(16).substr(2, 4).toUpperCase();
}
