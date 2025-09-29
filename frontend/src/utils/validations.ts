import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("Formato de e-mail inválido")
    .max(255, "E-mail deve ter no máximo 255 caracteres"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres"),
});

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .trim(),
  price: z
    .number({ invalid_type_error: "Preço deve ser um número" })
    .positive("Preço deve ser maior que zero")
    .max(999999.99, "Preço deve ser menor que R$ 999.999,99"),
  quantity: z
    .number({ invalid_type_error: "Quantidade deve ser um número" })
    .int("Quantidade deve ser um número inteiro")
    .min(0, "Quantidade não pode ser negativa")
    .max(999999, "Quantidade deve ser menor que 999.999"),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "O nome deve ter pelo menos 3 caracteres")
      .max(50, "O nome pode ter no máximo 50 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/,
        "A senha deve conter letra, número e caractere especial"
      ),
    confirmPassword: z.string().min(6, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
