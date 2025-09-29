import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/forms/Input";
import { Button } from "@/components/forms/Button";
import { useAuthStore } from "@/store/authStore";
import { loginSchema, type LoginFormData } from "@/utils/validations";
import { toast } from "@/hooks/use-toast";

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const result = await login({
        email: data.email,
        password: data.password,
      });

      if (result === true) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo(a) de volta.",
        });
        navigate(from, { replace: true });
      } else {
        setError("root", {
          message: "E-mail ou senha incorretos",
        });
        toast({
          title: result.error,
          description: result.message || "Não foi possível fazer login",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
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
            className="text-4xl font-extrabold mb-4 flex justify-center items-center gap-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Bem-vindo ao SaamAPP
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
          </motion.h1>

          <motion.p
            className="text-lg text-gray-100 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            💡{" "}
            <span className="font-semibold">
              Automatize seu negócio e ganhe tempo!
            </span>
            <br />
            Nosso sistema gera <strong>análises inteligentes</strong> sobre seus
            produtos e estoque, fornecendo insights em tempo real para melhorar
            a performance do seu negócio. 🚀
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
              Acessar conta
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Entre com suas credenciais para continuar
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700"
          >
            <div className="space-y-4">
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
                  placeholder="Digite sua senha"
                  error={errors.password?.message}
                  autoComplete="current-password"
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
              <LogIn className="h-5 w-5 mr-2" />
              Entrar
            </Button>

            <motion.p
              className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Não tem conta?{" "}
              <a
                href="/registrar"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Crie uma agora
              </a>
            </motion.p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
