import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, type FormValues } from "../lib/schema";

interface Props {
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="text-xs text-red mt-1">{error}</p>}
    </div>
  );
}

export default function ApplicationForm({ onSubmit, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Section: Business Profile */}
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-muted mb-3">
          Business Profile
        </p>
        <div className="space-y-3">
          <Field label="Owner Name" error={errors.ownerName?.message}>
            <input
              {...register("ownerName")}
              className="input-field"
              placeholder="Rajesh Kumar"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="PAN" error={errors.pan?.message}>
              <input
                {...register("pan")}
                className="input-field font-mono uppercase"
                placeholder="ABCDE1234F"
                maxLength={10}
              />
            </Field>

            <Field label="Business Type" error={errors.businessType?.message}>
              <select {...register("businessType")} className="input-field">
                <option value="">Select…</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="services">Services</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>

          <Field label="Monthly Revenue (₹)" error={errors.monthlyRevenue?.message}>
            <input
              {...register("monthlyRevenue", { valueAsNumber: true })}
              type="number"
              className="input-field"
              placeholder="500000"
              min={0}
            />
          </Field>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Section: Loan Details */}
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-muted mb-3">
          Loan Details
        </p>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Loan Amount (₹)" error={errors.loanAmount?.message}>
              <input
                {...register("loanAmount", { valueAsNumber: true })}
                type="number"
                className="input-field"
                placeholder="2000000"
                min={0}
              />
            </Field>

            <Field label="Tenure (months)" error={errors.tenureMonths?.message}>
              <input
                {...register("tenureMonths", { valueAsNumber: true })}
                type="number"
                className="input-field"
                placeholder="36"
                min={1}
                max={360}
              />
            </Field>
          </div>

          <Field label="Purpose of Loan" error={errors.loanPurpose?.message}>
            <input
              {...register("loanPurpose")}
              className="input-field"
              placeholder="Working capital, equipment purchase…"
            />
          </Field>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-ink text-paper rounded px-4 py-2.5 text-sm font-medium
                   hover:bg-ink/80 disabled:opacity-50 transition"
      >
        {isLoading ? "Processing…" : "Get Decision"}
      </button>
    </form>
  );
}
