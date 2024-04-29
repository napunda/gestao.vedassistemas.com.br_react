import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email digitado é inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  keepConnected: z.boolean().default(false).optional(),
});

export type LoginData = z.infer<typeof loginSchema>;
