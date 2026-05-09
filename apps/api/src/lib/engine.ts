/**
 * Credit Decision Engine
 *
 * Scoring model (0–100):
 *   - EMI burden ratio (monthly EMI / monthly revenue): 40 pts
 *   - Loan-to-revenue multiple: 30 pts
 *   - Tenure risk: 15 pts
 *   - PAN validity: 15 pts
 *
 * Threshold: score >= 50 → APPROVED
 *
 * Assumptions:
 *   - Simple EMI = loan / tenure (no interest; approximation for scoring)
 *   - PAN format: 5 alpha + 4 digit + 1 alpha (ABCDE1234F)
 *   - Revenue-to-EMI ratio < 2x is HIGH_EMI_BURDEN
 *   - Loan > 20x monthly revenue is HIGH_LOAN_RATIO
 *   - Tenure < 3 or > 60 months is TENURE_RISK
 *   - Monthly revenue < 50,000 is LOW_REVENUE
 */

export interface EngineInput {
  monthlyRevenue: number;
  requestedAmount: number;
  tenureMonths: number;
  pan: string;
}

export interface EngineOutput {
  decision: 'APPROVED' | 'REJECTED';
  creditScore: number;
  reasonCodes: string[];
}

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export function runDecisionEngine(input: EngineInput): EngineOutput {
  const { monthlyRevenue, requestedAmount, tenureMonths, pan } = input;
  const reasons: string[] = [];
  let score = 100;

  // PAN check (15 pts)
  if (!PAN_REGEX.test(pan.toUpperCase())) {
    score -= 15;
    reasons.push('INVALID_PAN');
  }

  // Low revenue check
  if (monthlyRevenue < 50_000) {
    score -= 20;
    reasons.push('LOW_REVENUE');
  }

  // Loan-to-revenue multiple (30 pts)
  const loanMultiple = requestedAmount / monthlyRevenue;
  if (loanMultiple > 50) {
    score -= 30;
    reasons.push('DATA_INCONSISTENCY');
  } else if (loanMultiple > 20) {
    score -= 20;
    reasons.push('HIGH_LOAN_RATIO');
  } else if (loanMultiple > 10) {
    score -= 10;
  }

  // EMI burden (40 pts) — simple EMI = principal / tenure
  const monthlyEmi = requestedAmount / tenureMonths;
  const emiRatio = monthlyEmi / monthlyRevenue;
  if (emiRatio > 0.6) {
    score -= 40;
    reasons.push('HIGH_EMI_BURDEN');
  } else if (emiRatio > 0.4) {
    score -= 20;
    reasons.push('HIGH_EMI_BURDEN');
  } else if (emiRatio > 0.3) {
    score -= 10;
  }

  // Tenure risk (15 pts)
  if (tenureMonths < 3 || tenureMonths > 60) {
    score -= 15;
    reasons.push('TENURE_RISK');
  }

  score = Math.max(0, Math.min(100, score));

  if (score >= 50 && reasons.length === 0) {
    reasons.push('STRONG_PROFILE');
  }

  return {
    decision: score >= 50 ? 'APPROVED' : 'REJECTED',
    creditScore: score,
    reasonCodes: reasons,
  };
}
