// Server-side in-memory mock bank store for DevFlow demos.
// Persisted via globalThis to survive hot reload in dev.

function initStore() {
  return {
    accounts: {
      "1002003004": {
        accountNumber: "1002003004",
        name: "Rahul Sharma",
        phone: "+91 98XXX 12XXX",
        balance: 12450,
        pin: "1234",
        cibilScore: 742,
        deviceHistory: ["DEVFLOW-DEVICE-A"],
        locationHistory: ["Trichy"],
        transactions: [
          { id: "TXN-001", type: "deposit", amount: 5000, counterparty: "Cash Deposit", at: Date.now() - 86400000 * 2 },
          { id: "TXN-002", type: "sent", amount: 500, counterparty: "UPI: kumar@upi", at: Date.now() - 86400000 },
          { id: "TXN-003", type: "sent", amount: 1000, counterparty: "A/C 9988776655", at: Date.now() - 3600000 * 6 },
          { id: "TXN-004", type: "received", amount: 2500, counterparty: "Scholarship", at: Date.now() - 3600000 * 2 },
          { id: "TXN-005", type: "sent", amount: 500, counterparty: "UPI: store@upi", at: Date.now() - 3600000 },
        ],
      },
    },
    otps: {}, // accountNumber -> { otp, expiresAt }
    fraudEvents: [], // recent fraud guardian decisions
    fdAccounts: [], // created FDs
  };
}

export function getBankStore() {
  if (!globalThis.__DEVFLOW_BANK_STORE__) {
    globalThis.__DEVFLOW_BANK_STORE__ = initStore();
  }
  return globalThis.__DEVFLOW_BANK_STORE__;
}

export function pushFraudEvent(event) {
  const store = getBankStore();
  store.fraudEvents.unshift(event);
  store.fraudEvents = store.fraudEvents.slice(0, 50);
}

