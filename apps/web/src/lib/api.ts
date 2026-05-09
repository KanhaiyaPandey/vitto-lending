const API_BASE = import.meta.env.VITE_API_URL || '/api';

export interface ApplicationPayload {
  business: {
    ownerName: string;
    pan: string;
    businessType: string;
    monthlyRevenue: number;
  };
  loan: {
    requestedAmount: number;
    tenureMonths: number;
    purpose: string;
  };
}

export interface DecisionResult {
  applicationId: string;
  decision: 'APPROVED' | 'REJECTED';
  creditScore: number;
  reasonCodes: string[];
  createdAt: string;
}

export async function submitApplication(payload: ApplicationPayload): Promise<DecisionResult> {
  const res = await fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Submission failed');
  return data;
}

export async function fetchAuditLog() {
  const res = await fetch(`${API_BASE}/applications`);
  if (!res.ok) throw new Error('Failed to fetch audit log');
  return res.json();
}
