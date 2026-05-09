import { z } from "zod";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export const formSchema = z.object({
  ownerName: z.string().min(2, "Name must be at least 2 characters"),
  pan: z
    .string()
    .toUpperCase()
    .regex(PAN_REGEX, "Invalid PAN — expected format: ABCDE1234F"),
  businessType: z.enum(["retail", "manufacturing", "services", "other"], {
    errorMap: () => ({ message: "Select a business type" }),
  }),
  monthlyRevenue: z
    .number({ invalid_type_error: "Enter a valid number" })
    .positive("Must be positive"),
  loanAmount: z
    .number({ invalid_type_error: "Enter a valid number" })
    .positive("Must be positive"),
  tenureMonths: z
    .number({ invalid_type_error: "Enter a valid number" })
    .int()
    .min(1)
    .max(360),
  loanPurpose: z.string().min(3, "Describe the loan purpose"),
});

export type FormValues = z.infer<typeof formSchema>;
