import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Plus,
  TrendingUp,
  ShoppingCart,
  RefreshCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/forms/Button";
import { useAuthStore } from "@/store/authStore";
import { useProductStore } from "@/store/productStore";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { products, isLoading, error, fetch } = useProductStore();

  useEffect(() => {
    fetch(0, 10);
  }, [fetch]);

  const totalProducts = products.length;
  const totalValue = useMemo(
    () => products.reduce((acc, p) => acc + p.price * p.quantity, 0),
    [products]
  );
  const inStock = useMemo(
    () => products.filter((p) => p.quantity > 0).length,
    [products]
  );

  const stats = [
    {
      title: "Total de Produtos",
      value: totalProducts.toString(),
      icon: Package,
      description: "Produtos cadastrados",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Valor Total",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(totalValue),
      icon: TrendingUp,
      description: "Valor em estoque (página atual)",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Em Estoque",
      value: inStock.toString(),
      icon: ShoppingCart,
      description: "Com quantidade disponível",
      color: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
            Bem-vindo, {user?.name || "usuário"}!
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Gerencie seus produtos e acompanhe estatísticas do estoque.
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              onClick={() => fetch(0, 10)}
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        )}

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4">
            Estatísticas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? [1, 2, 3].map((k) => (
                  <div
                    key={k}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm"
                  >
                    <Skeleton className="h-5 w-32 mb-3" />
                    <Skeleton className="h-8 w-40 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))
              : stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-gray-100">
                            {stat.value}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {stat.description}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                          <Icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/produtos" className="w-full">
              <Button
                className="w-full h-auto p-5 justify-start text-left border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md rounded-xl"
                variant="outline"
              >
                <div className="flex items-center">
                  <Plus className="h-5 w-5 mr-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-gray-100">
                      Cadastrar / Ver Produtos
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Adicione novos produtos ou consulte o estoque
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4">
            Produtos em Estoque
          </h2>

          {isLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
              <Skeleton className="h-6 w-48 mb-4" />
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-4 gap-4 py-3 border-t dark:border-gray-700"
                >
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Nenhum produto cadastrado
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Comece cadastrando seus produtos para visualizar estatísticas e
                relatórios.
              </p>
              <Link to="/produtos">
                <Button className="mt-4">Cadastrar produto</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Quantidade
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Preço
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                        {product.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(product.price)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(product.price * product.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
