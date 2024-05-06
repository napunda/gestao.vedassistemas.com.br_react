import { z } from "zod";

export const AddUserSchema = z.object({
  email: z.string().email("Email digitado é inválido"),
  username: z
    .string()
    .min(3, "O nome de usuário deve ter no mínimo 3 caracteres"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  web_password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .optional(),
});

export type UserData = z.infer<typeof AddUserSchema>;
