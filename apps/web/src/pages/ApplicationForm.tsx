import { useState } from 'react';
import { Field, Input, Select } from '../components/Field';
import { DecisionCard } from '../components/DecisionCard';
import { submitApplication, type DecisionResult } from '../lib/api';

interface FormState {
  ownerName: string;
  pan: string;
  businessType: string;
  monthlyRevenue: string;
  requestedAmount: string;
  tenureMonths: string;
  purpose: string;
}

const empty: FormState = {
  ownerName: '',
  pan: '',
  businessType: '',
  monthlyRevenue: '',
  requestedAmount: '',
  tenureMonths: '',
  purpose: '',
};

type Errors = Partial<Record<keyof FormState, string>>;

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!f.ownerName.trim()) e.ownerName = 'Required';
  if (!f.pan.trim()) e.pan = 'Required';
  else if (!/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/.test(f.pan.trim()))
    e.pan = 'Format: ABCDE1234F';
  if (!f.businessType) e.businessType = 'Required';
  if (!f.monthlyRevenue) e.monthlyRevenue = 'Required';
  else if (isNaN(Number(f.monthlyRevenue)) || Number(f.monthlyRevenue) <= 0)
    e.monthlyRevenue = 'Must be a positive number';
  if (!f.requestedAmount) e.requestedAmount = 'Required';
  else if (isNaN(Number(f.requestedAmount)) || Number(f.requestedAmount) <= 0)
    e.requestedAmount = 'Must be a positive number';
  if (!f.tenureMonths) e.tenureMonths = 'Required';
  else if (!Number.isInteger(Number(f.tenureMonths)) || Number(f.tenureMonths) <= 0)
    e.tenureMonths = 'Must be a positive integer';
  if (!f.purpose.trim()) e.purpose = 'Required';
  return e;
}

export function ApplicationForm() {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [result, setResult] = useState<DecisionResult | null>(null);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async () => {
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setApiError('');
    try {
      const res = await submitApplication({
        business: {
          ownerName: form.ownerName.trim(),
          pan: form.pan.trim().toUpperCase(),
          businessType: form.businessType,
          monthlyRevenue: Number(form.monthlyRevenue),
        },
        loan: {
          requestedAmount: Number(form.requestedAmount),
          tenureMonths: Number(form.tenureMonths),
          purpose: form.purpose.trim(),
        },
      });
      setResult(res);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm(empty);
    setErrors({});
    setResult(null);
    setApiError('');
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="border-b border-border px-6 py-4 flex items-center gap-3">
        <span className="font-mono font-medium text-ink text-sm tracking-tight">vitto</span>
        <span className="text-border">·</span>
        <span className="text-xs text-muted font-mono">MSME Credit</span>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-ink mb-1">
              {result ? 'Credit Decision' : 'Loan Application'}
            </h1>
            <p className="text-sm text-muted">
              {result
                ? 'Review the credit assessment below.'
                : 'Fill in business and loan details to receive an instant decision.'}
            </p>
          </div>

          <div className="bg-white border border-border rounded-lg p-6">
            {result ? (
              <DecisionCard result={result} onReset={reset} />
            ) : (
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-xs font-mono text-muted uppercase tracking-widest mb-4 pb-2 border-b border-border">
                    Business Profile
                  </p>
                  <div className="flex flex-col gap-4">
                    <Field label="Owner Name" error={errors.ownerName}>
                      <Input
                        value={form.ownerName}
                        onChange={set('ownerName')}
                        placeholder="Ramesh Kumar"
                        hasError={!!errors.ownerName}
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="PAN" error={errors.pan}>
                        <Input
                          value={form.pan}
                          onChange={set('pan')}
                          placeholder="ABCDE1234F"
                          maxLength={10}
                          className="uppercase"
                          hasError={!!errors.pan}
                        />
                      </Field>
                      <Field label="Business Type" error={errors.businessType}>
                        <Select
                          value={form.businessType}
                          onChange={set('businessType')}
                          hasError={!!errors.businessType}
                        >
                          <option value="">Select</option>
                          <option value="retail">Retail</option>
                          <option value="manufacturing">Manufacturing</option>
                          <option value="services">Services</option>
                          <option value="other">Other</option>
                        </Select>
                      </Field>
                    </div>

                    <Field label="Monthly Revenue (INR)" error={errors.monthlyRevenue}>
                      <Input
                        type="number"
                        value={form.monthlyRevenue}
                        onChange={set('monthlyRevenue')}
                        placeholder="500000"
                        min={0}
                        hasError={!!errors.monthlyRevenue}
                      />
                    </Field>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-mono text-muted uppercase tracking-widest mb-4 pb-2 border-b border-border">
                    Loan Details
                  </p>
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Loan Amount (INR)" error={errors.requestedAmount}>
                        <Input
                          type="number"
                          value={form.requestedAmount}
                          onChange={set('requestedAmount')}
                          placeholder="2000000"
                          min={0}
                          hasError={!!errors.requestedAmount}
                        />
                      </Field>
                      <Field label="Tenure (months)" error={errors.tenureMonths}>
                        <Input
                          type="number"
                          value={form.tenureMonths}
                          onChange={set('tenureMonths')}
                          placeholder="24"
                          min={1}
                          hasError={!!errors.tenureMonths}
                        />
                      </Field>
                    </div>

                    <Field label="Purpose" error={errors.purpose}>
                      <Input
                        value={form.purpose}
                        onChange={set('purpose')}
                        placeholder="Working capital, equipment purchase..."
                        hasError={!!errors.purpose}
                      />
                    </Field>
                  </div>
                </div>

                {apiError && (
                  <p className="text-xs text-red-600 font-mono bg-red-50 border border-red-200 rounded px-3 py-2">
                    {apiError}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="mt-1 w-full bg-ink text-paper text-sm font-medium py-2.5 rounded hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Submit Application'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border px-6 py-4 text-center">
        <p className="text-xs text-muted font-mono">Vitto · MSME Lending Platform · Confidential</p>
      </footer>
    </div>
  );
}
