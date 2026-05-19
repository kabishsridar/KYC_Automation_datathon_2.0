import { getBankStore, pushFraudEvent } from "./bankingStore";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function avgSentAmount(transactions) {
  const sent = transactions.filter((t) => t.type === "sent");
  if (sent.length === 0) return 500;
  return sent.reduce((a, t) => a + t.amount, 0) / sent.length;
}

function identityGraphReceiverRisk(receiver) {
  // Lightweight simulation: certain patterns/receivers are suspicious.
  const s = String(receiver || "").toLowerCase();
  if (!s) return { flagged: false, reason: null, score: 0 };
  const suspicious = s.includes("9999") || s.includes("fraud") || s.endsWith("666") || s.includes("scam");
  return suspicious
    ? { flagged: true, reason: "Receiver linked to suspicious identity graph cluster", score: 25 }
    : { flagged: false, reason: null, score: 0 };
}

export function evaluateFraudRisk({ account, tx, context }) {
  // context: { deviceId, city, ip }
  const store = getBankStore();
  const acct = store.accounts[account];
  if (!acct) {
    return {
      riskScore: 80,
      decision: "block",
      flags: ["Unknown account"],
      requiresOtp: false,
      requiresPin: true,
    };
  }

  const flags = [];
  let score = 0;

  // 1) Device fingerprint
  if (context?.deviceId && !acct.deviceHistory.includes(context.deviceId)) {
    flags.push("New device detected");
    score += 18;
  }

  // 2) Location change
  if (context?.city && !acct.locationHistory.includes(context.city)) {
    flags.push("Unusual login location");
    score += 12;
  }

  // 3) Identity graph check (receiver)
  const receiverRisk = identityGraphReceiverRisk(tx?.receiver);
  if (receiverRisk.flagged) {
    flags.push(receiverRisk.reason);
    score += receiverRisk.score;
  }

  // 4) Transaction behaviour (amount anomaly)
  const baseAvg = avgSentAmount(acct.transactions);
  const amount = Number(tx?.amount || 0);
  if (amount >= baseAvg * 20 || amount >= 50000) {
    flags.push("Abnormal transaction amount");
    score += 30;
  } else if (amount >= baseAvg * 8 || amount >= 10000) {
    flags.push("Elevated transaction amount");
    score += 18;
  }

  // IP reuse is simulated with simple heuristic
  if (context?.ip && String(context.ip).startsWith("10.1.")) {
    flags.push("Shared network IP segment");
    score += 7;
  }

  score = clamp(Math.round(score), 0, 100);

  let decision = "allow";
  let requiresOtp = false;
  const requiresPin = true;

  if (score >= 70) {
    decision = "block";
  } else if (score >= 40) {
    decision = "otp";
    requiresOtp = true;
  }

  return { riskScore: score, decision, flags, requiresOtp, requiresPin };
}

export function logFraudDecision({ account, tx, context, evaluation, outcome }) {
  pushFraudEvent({
    at: Date.now(),
    account,
    tx,
    context,
    evaluation,
    outcome, // "blocked" | "otp_required" | "approved" | "failed"
    ref: `FG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  });
}

