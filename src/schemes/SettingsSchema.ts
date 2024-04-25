import { z } from "zod";

export const settingsSchema = z
  .object({
    name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("Email digitado é inválido"),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
    testing_period_limit_days: z
      .number()
      .int()
      .min(1, "O período de teste deve ser de no mínimo 1 dia"),
  })
  .refine(
    (values) => {
      if (values.password && values.password_confirmation) {
        return values.password.length >= 6;
      }
      return true;
    },
    {
      message: "A senha deve ter no mínimo 6 caracteres",
      path: ["password"],
    }
  )
  .refine(
    (values) => {
      return values.password === values.password_confirmation;
    },
    {
      message: "As senhas não conferem",
      path: ["password_confirmation"],
    }
  );

export type SettingsData = z.infer<typeof settingsSchema>;
