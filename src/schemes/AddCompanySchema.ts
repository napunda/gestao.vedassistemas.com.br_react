import { z } from "zod";
import { cpf, cnpj } from "cpf-cnpj-validator";

const isCpfOrCnpj = (val: string) => cpf.isValid(val) || cnpj.isValid(val);
const documentSchema = z.string().refine(isCpfOrCnpj, {
  message: "Campo documento deve ser um CPF ou CNPJ válido",
});

export const AddCompanySchema = z
  .object({
    id_machine: z
      .string()
      .min(1, "Campo id_machine deve ter no mínimo 1 caractere"),
    document: documentSchema,
    name: z.string().min(5, "Campo nome deve ter no mínimo 5 caracteres"),
    address: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    phone: z.string().optional(),
    access_allowed: z.boolean().default(false).optional(),
    test_period_active: z.boolean().default(false).optional(),
  })
  .refine(
    ({ address }) => {
      if (address) {
        return address.length >= 5;
      }
      return true;
    },
    {
      message: "Campo endereço deve ter no mínimo 5 caracteres",
      path: ["address"],
    }
  )
  .refine(
    ({ complement }) => {
      if (complement) {
        return complement.length >= 5;
      }
      return true;
    },
    {
      message: "Campo complemento deve ter no mínimo 5 caracteres",
      path: ["complement"],
    }
  )
  .refine(
    ({ neighborhood }) => {
      if (neighborhood) {
        return neighborhood.length >= 5;
      }
      return true;
    },
    {
      message: "Campo bairro deve ter no mínimo 5 caracteres",
      path: ["neighborhood"],
    }
  )
  .refine(
    ({ city }) => {
      if (city) {
        return city.length >= 5;
      }
      return true;
    },
    {
      message: "Campo cidade deve ter no mínimo 5 caracteres",
      path: ["city"],
    }
  )
  .refine(
    ({ state }) => {
      if (state) {
        return state.length >= 2;
      }
      return true;
    },
    {
      message: "Campo estado deve ter no mínimo 2 caracteres",
      path: ["state"],
    }
  )
  .refine(
    ({ phone }) => {
      if (phone) {
        return phone.length >= 11;
      }
      return true;
    },
    {
      message: "Campo telefone deve ter no mínimo 11 caracteres",
      path: ["phone"],
    }
  );

export type AddCompanyData = z.infer<typeof AddCompanySchema>;
