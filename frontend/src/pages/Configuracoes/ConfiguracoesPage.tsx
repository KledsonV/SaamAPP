import React, { useState } from "react";
import {
  Mail,
  Save,
  CheckCircle2,
  Shield,
  Globe,
  Eye,
  EyeOff,
  User,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/forms/Button";
import { Input } from "@/components/forms/Input";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/hooks/use-toast";
import icon from "/icon.png";

export const ConfiguracoesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [showEmail, setShowEmail] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    await new Promise((r) => setTimeout(r, 600));

    setIsSaving(false);
    setSaved(true);

    toast({
      title: "Configurações salvas!",
      description: "Suas preferências foram atualizadas com sucesso.",
    });

    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 transition-colors duration-500">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
                Configurações da Conta
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gerencie suas informações e preferências pessoais
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg ring-2 ring-indigo-500/30">
                    <img
                      src={icon}
                      alt="Foto do usuário"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Olá, {user?.name || "Usuário"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Aqui você pode revisar e atualizar seus dados
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <User className="w-4 h-4" />
                      Nome
                    </label>
                    <Input
                      value={user?.name || ""}
                      disabled
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="w-4 h-4" />
                      E-mail
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={
                          showEmail ? user?.email || "" : "•••••@••••••.com"
                        }
                        disabled
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                      />
                      <button
                        onClick={() => setShowEmail(!showEmail)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                        type="button"
                      >
                        {showEmail ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={handleSave}
                    disabled={true}
                    className={`w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
                      isSaving ? "animate-pulse" : ""
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Salvando...
                      </>
                    ) : saved ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Salvo!
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Salvar Configurações
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                Status da Conta
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-300">
                      Conta ativa
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Dados protegidos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl border border-indigo-100 dark:border-indigo-800 shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Dicas
              </h3>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  • Revise seus dados regularmente para manter tudo atualizado.
                </p>
                <p>• Suas informações ficam seguras e privadas.</p>
                <p>• Utilize senhas fortes e altere-as periodicamente.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: translateY(0);} }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ConfiguracoesPage;
