import type { DecisionResult } from "@vitto/shared";

const REASON_LABELS: Record<string, string> = {
  LOW_REVENUE: "Revenue below threshold",
  HIGH_LOAN_RATIO: "Loan-to-revenue ratio too high",
  HIGH_EMI_BURDEN: "EMI burden exceeds 50% of revenue",
  TENURE_RISK: "Tenure outside optimal range",
  DATA_INCONSISTENCY: "Loan amount disproportionate to revenue",
  STRONG_REVENUE_COVERAGE: "Strong revenue-to-EMI coverage",
  ACCEPTABLE_LOAN_RATIO: "Loan-to-revenue ratio within limits",
  GOOD_TENURE: "Tenure is well structured",
  INVALID_PAN: "PAN format is invalid",
  STRONG_PROFILE: "Strong overall profile",
};

interface Props {
  result: DecisionResult;
  onReset: () => void;
}

export default function DecisionView({ result, onReset }: Props) {
  const approved = result.decision === "APPROVED";

  return (
    <div className="space-y-6">
      {/* Status banner */}
      <div
        className={`rounded-lg px-5 py-4 ${
          approved ? "bg-green-light" : "bg-red-light"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest font-medium text-muted mb-1">
              Decision
            </p>
            <p
              className={`text-2xl font-semibold ${
                approved ? "text-green" : "text-red"
              }`}
            >
              {approved ? "Approved" : "Rejected"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest font-medium text-muted mb-1">
              Credit Score
            </p>
            <p className="text-2xl font-mono font-medium">{result.creditScore}</p>
            <p className="text-xs text-muted">out of 100</p>
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div>
        <div className="flex justify-between text-xs text-muted mb-1">
          <span>0</span>
          <span>Threshold: 50</span>
          <span>100</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              approved ? "bg-green" : "bg-red"
            }`}
            style={{ width: `${result.creditScore}%` }}
          />
        </div>
        <div
          className="h-2 relative"
          style={{ marginTop: "-8px", paddingLeft: "50%" }}
        >
          <div className="w-px h-3 bg-muted/50 inline-block" />
        </div>
      </div>

      {/* EMI */}
      <div className="border border-border rounded-lg px-4 py-3 flex items-center justify-between">
        <p className="text-sm text-muted">Estimated monthly EMI</p>
        <p className="font-mono font-medium text-sm">
          ₹{result.monthlyEmi.toLocaleString("en-IN")}
        </p>
      </div>

      {/* Reason codes */}
      <div>
        <p className="label">Reason Codes</p>
        <div className="space-y-2">
          {result.reasonCodes.map((code) => {
            const isPositive = [
              "STRONG_REVENUE_COVERAGE",
              "ACCEPTABLE_LOAN_RATIO",
              "GOOD_TENURE",
            ].includes(code);
            return (
              <div
                key={code}
                className={`flex items-start gap-2 rounded px-3 py-2 text-sm ${
                  isPositive
                    ? "bg-green-light text-green"
                    : "bg-red-light text-red"
                }`}
              >
                <span className="font-mono text-xs mt-0.5 shrink-0">
                  {isPositive ? "+" : "−"}
                </span>
                <span>{REASON_LABELS[code] ?? code}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* App ID */}
      <p className="text-xs text-muted font-mono">
        ref: {result.applicationId}
      </p>

      <button
        onClick={onReset}
        className="w-full border border-border rounded px-4 py-2 text-sm
                   hover:bg-ink hover:text-paper transition text-muted"
      >
        New Application
      </button>
    </div>
  );
}
