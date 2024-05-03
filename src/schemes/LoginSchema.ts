import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "O campo digitado é inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  keepConnected: z.boolean().default(false).optional(),
});

export type LoginData = z.infer<typeof loginSchema>;
