import { useNavigate } from "react-router-dom";
import { Button } from "@/components/forms/Button";
import { Home, Search, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6">
      <motion.div
        className="text-center max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Search className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h1
          className="text-6xl font-extrabold text-gray-900 dark:text-gray-100"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          404
        </motion.h1>

        <motion.p
          className="mt-4 text-lg text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Oops! Página não encontrada.
        </motion.p>

        <motion.p
          className="mt-2 text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Parece que a página que você está procurando não existe ou foi movida.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold"
          >
            <Home className="w-5 h-5" />
            Página Inicial
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 shadow-md transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
