/**
 * Voice Assistant Module
 */

const voiceDictionary = {
    'en': {
        'welcome': "Welcome. Choose a service.",
        'send-money-1': "Press Send Money to transfer funds.",
        'send-money-2': "Enter the receiver account number.",
        'send-money-amount': "Enter the amount to send.",
        'send-money-confirm': "Please confirm the transaction.",
        'send-money-success': "Your transaction was successful.",
        'deposit-cash-1': "Deposit your cash at the kiosk.",
        'deposit-cash-amt': "Enter the amount you want to deposit.",
        'deposit-cash-success': "Your deposit is successful.",
        'balance-pin': "Please enter your 4-digit PIN to check balance.",
        'balance': "Your current balance is twelve thousand four hundred and fifty rupees.",
        'history': "Here are your recent transactions."
    },
    'ta': {
        'welcome': "வரவேற்கிறோம். ஒரு சேவையை தேர்வு செய்யவும்.",
        'send-money-1': "பணம் அனுப்ப 'Send Money' பொத்தானை அழுத்தவும்.",
        'send-money-2': "பெறுநரின் கணக்கு எண்ணை உள்ளிடவும்.",
        'send-money-amount': "அனுப்ப வேண்டிய தொகையை உள்ளிடவும்.",
        'send-money-confirm': "பரிவர்த்தனையை உறுதிப்படுத்தவும்.",
        'send-money-success': "உங்கள் பரிவர்த்தனை வெற்றிகரமாக முடிந்தது.",
        'deposit-cash-1': "பணத்தை கியோஸ்க் மையத்தில் வை.",
        'deposit-cash-amt': "வைப்பதற்கான தொகையை உள்ளிடவும்.",
        'deposit-cash-success': "உங்கள் வைப்பு வெற்றிகரமாக முடிந்தது.",
        'balance-pin': "இருப்புச் சரிபார்க்க உங்கள் 4-இலக்க பின்னை உள்ளிடவும்.",
        'balance': "உங்கள் தற்போதைய இருப்பு பன்னிரெண்டாயிரத்து நானூற்று ஐம்பது ரூபாய்.",
        'history': "இவை உங்கள் சமீபத்திய பரிவர்த்தனைகள்."
    }
};

let currentLang = 'en';
let synth = window.speechSynthesis;

function playVoiceText(key, silent = false) {
    if (silent) {
        synth.cancel();
        document.getElementById('voice-indicator').classList.add('hidden');
        return;
    }

    const text = voiceDictionary[currentLang][key] || voiceDictionary['en'][key];
    document.getElementById('voice-text').textContent = text;
    document.getElementById('voice-indicator').classList.remove('hidden');

    if (synth.speaking) synth.cancel();
    const utterThis = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    
    if (currentLang === 'ta') {
        const taVoice = voices.find(v => v.lang.includes('ta')) || voices.find(v => v.lang.includes('hi')) || voices.find(v => v.lang.includes('IN'));
        if (taVoice) utterThis.voice = taVoice;
        utterThis.lang = 'ta-IN';
    } else {
        const enVoice = voices.find(v => v.lang.includes('en-IN')) || voices.find(v => v.lang.includes('en'));
        if (enVoice) utterThis.voice = enVoice;
        utterThis.lang = 'en-IN';
    }
    synth.speak(utterThis);
}

function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${lang}`).classList.add('active');
    playVoiceText('welcome');
}
