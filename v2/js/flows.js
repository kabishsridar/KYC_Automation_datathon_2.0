/**
 * Feature Flows Controller (Send, Deposit, Balance, History)
 */

function startFlow(flowType) {
    if (flowType === 'send-money') {
        switchScreen('screen-send-money');
        switchStep('send', 1);
        playVoiceText('send-money-2');
    } else if (flowType === 'deposit') {
        switchScreen('screen-deposit');
        switchStep('dep', 1);
        playVoiceText('deposit-cash-amt');
    } else if (flowType === 'balance') {
        switchScreen('screen-balance');
        switchStep('bal', 1);
        playVoiceText('balance-pin');
    } else if (flowType === 'history') {
        switchScreen('screen-history');
        playVoiceText('history');
    }
}

function selectAmount(amt, event) {
    document.getElementById('send-amount').value = amt;
    document.querySelectorAll('#screen-send-money .preset-btn').forEach(b => b.classList.remove('selected'));
    if (event) event.target.classList.add('selected');
}

function selectDepAmount(amt, event) {
    document.getElementById('dep-amount').value = amt;
    document.querySelectorAll('#screen-deposit .preset-btn').forEach(b => b.classList.remove('selected'));
    if (event) event.target.classList.add('selected');
}

function nextSendStep(stepNum) {
    if (stepNum === 5) {
        simulateLedgerSync(() => {
            switchStep('send', 5);
            playVoiceText('silent', true);
        });
        return;
    }
    switchStep('send', stepNum);
    if (stepNum === 2) {
        playVoiceText('send-money-2');
    } else if (stepNum === 3) {
        playVoiceText('send-money-amount');
    } else if (stepNum === 4) {
        const amt = document.getElementById('send-amount').value || 0;
        document.getElementById('confirm-amount').textContent = `₹ ${amt}`;
        playVoiceText('send-money-confirm');
    }
}

function completeSend() {
    const pin = document.getElementById('send-pin').value;
    if (pin.length !== 4) return;
    
    const finalHash = generateFinalHash();
    document.getElementById('final-hash-display').textContent = `HASH: ${finalHash}`;

    switchStep('send', 6);
    playVoiceText('send-money-success');
    document.getElementById('send-pin').value = '';
}

function nextDepStep(stepNum) {
    switchStep('dep', stepNum);
    if (stepNum === 2) {
        playVoiceText('silent', true);
        setTimeout(() => {
            switchStep('dep', 3);
            playVoiceText('deposit-cash-success');
        }, 4000);
    }
}

function verifyBalancePin() {
    const pin = document.getElementById('bal-pin').value;
    if (pin.length !== 4) return;

    switchStep('bal', 2);
    playVoiceText('balance');
    document.getElementById('bal-pin').value = '';
}
