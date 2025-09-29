import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Input } from "@/components/forms/Input";
import { Button } from "@/components/forms/Button";
import { registerSchema, type RegisterFormData } from "@/utils/validations";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export const RegistroPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { registerUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const result = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        role: "USER",
      });
      if (result === true) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Você já pode fazer login no SaamAPP.",
        });
        navigate("/login");
      } else {
        setError("root", {
          message: result.message || "Não foi possível criar a conta.",
        });
        toast({
          title: result.error ?? "Erro no registro",
          description: result.message ?? "Tente novamente em alguns instantes.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <motion.div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-900 items-center justify-center relative overflow-hidden"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative z-10 text-center text-white max-w-md px-8">
          <motion.h1
            className="text-4xl font-extrabold mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Crie sua conta no SaamAPP
          </motion.h1>
          <motion.p
            className="text-lg text-gray-100 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            🌟 Simplifique a gestão do seu estoque com nossa{" "}
            <strong>consultoria inteligente</strong>. Tenha informações precisas
            e decisões estratégicas em tempo real para fazer seu negócio
            crescer.
          </motion.p>
        </div>
      </motion.div>

      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
              Criar conta
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Preencha os campos abaixo para se cadastrar
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700"
          >
            <div className="space-y-4">
              <Input
                {...register("username")}
                type="text"
                label="Nome completo"
                placeholder="Seu nome"
                error={errors.username?.message}
                autoComplete="name"
              />

              <Input
                {...register("email")}
                type="email"
                label="E-mail"
                placeholder="seu@email.com"
                error={errors.email?.message}
                autoComplete="email"
              />

              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  label="Senha"
                  placeholder="Crie uma senha"
                  error={errors.password?.message}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-11 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="relative">
                <Input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirme sua senha"
                  placeholder="Repita sua senha"
                  error={errors.confirmPassword?.message}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-11 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {errors.root && (
              <motion.div
                className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-3 rounded-md text-sm font-medium text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.root.message}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
              loading={isLoading}
              disabled={isLoading}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Criar Conta
            </Button>

            <motion.p
              className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Já tem uma conta?{" "}
              <a
                href="/login"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Faça login
              </a>
            </motion.p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
