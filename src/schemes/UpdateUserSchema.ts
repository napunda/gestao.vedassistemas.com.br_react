import { z } from "zod";

export const UpdateUserSchema = z
  .object({
    email: z.string().email("Email digitado é inválido"),
    name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
    password: z.string().optional(),
    web_password: z.string().optional(),
  })
  .refine(
    (values) => {
      if (values.password) {
        return values.password.length >= 8;
      }
      return true;
    },
    {
      message: "A senha deve ter no mínimo 8 caracteres",
      path: ["password"],
    }
  )
  .refine(
    (values) => {
      if (values.web_password) {
        return values.web_password.length >= 8;
      }
      return true;
    },
    {
      message: "A senha web deve ter no mínimo 8 caracteres",
      path: ["web_password"],
    }
  );

export type UserData = z.infer<typeof UpdateUserSchema>;
