import type { DecisionResult } from '../lib/api';

const REASON_LABELS: Record<string, string> = {
  LOW_REVENUE: 'Monthly revenue below minimum threshold',
  HIGH_LOAN_RATIO: 'Loan exceeds 20x monthly revenue',
  HIGH_EMI_BURDEN: 'EMI burden exceeds 40% of revenue',
  INVALID_PAN: 'PAN format is invalid',
  DATA_INCONSISTENCY: 'Loan amount is disproportionate to revenue',
  TENURE_RISK: 'Tenure is outside acceptable range (3-60 months)',
  STRONG_PROFILE: 'Application meets all credit criteria',
};

interface Props {
  result: DecisionResult;
  onReset: () => void;
}

export function DecisionCard({ result, onReset }: Props) {
  const approved = result.decision === 'APPROVED';

  return (
    <div className="flex flex-col gap-6">
      <div className={`rounded border px-5 py-5 ${approved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-muted uppercase tracking-widest mb-1">Decision</p>
            <p className={`text-2xl font-semibold ${approved ? 'text-green-600' : 'text-red-600'}`}>
              {approved ? 'Approved' : 'Rejected'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono text-muted uppercase tracking-widest mb-1">Credit Score</p>
            <p className="text-2xl font-mono font-medium">
              {result.creditScore}<span className="text-sm text-muted">/100</span>
            </p>
          </div>
        </div>
        <div className="mt-4 h-1.5 bg-white rounded-full overflow-hidden border border-border">
          <div
            className={`h-full rounded-full ${approved ? 'bg-green-600' : 'bg-red-500'}`}
            style={{ width: `${result.creditScore}%` }}
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-3">Signal Breakdown</p>
        <div className="flex flex-col gap-2">
          {result.reasonCodes.map((code) => (
            <div key={code} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
              <span className="font-mono text-xs bg-paper border border-border rounded px-1.5 py-0.5 shrink-0 mt-0.5">
                {code}
              </span>
              <span className="text-sm text-muted">{REASON_LABELS[code] ?? code}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-1">
        <p className="font-mono text-xs text-muted">
          ID: {result.applicationId.slice(0, 8)}...
        </p>
        <button onClick={onReset} className="text-sm text-accent hover:underline font-medium">
          New application
        </button>
      </div>
    </div>
  );
}
