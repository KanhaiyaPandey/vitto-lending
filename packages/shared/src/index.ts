// Shared types between frontend and backend

export interface BusinessProfile {
  ownerName: string;
  pan: string;
  businessType: 'retail' | 'manufacturing' | 'services' | 'other';
  monthlyRevenue: number;
}

export interface LoanApplication {
  requestedAmount: number;
  tenureMonths: number;
  purpose: string;
}

export interface ApplicationPayload {
  business: BusinessProfile;
  loan: LoanApplication;
}

export interface DecisionResult {
  applicationId: string;
  decision: 'APPROVED' | 'REJECTED';
  creditScore: number;
  monthlyEmi: number;
  reasonCodes: string[];
  createdAt: string;
}

export type ReasonCode =
  | 'LOW_REVENUE'
  | 'HIGH_LOAN_RATIO'
  | 'HIGH_EMI_BURDEN'
  | 'INVALID_PAN'
  | 'DATA_INCONSISTENCY'
  | 'TENURE_RISK'
  | 'STRONG_PROFILE';
