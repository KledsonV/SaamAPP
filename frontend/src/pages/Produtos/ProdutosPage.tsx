import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Package,
  Edit,
  Trash2,
  RefreshCcw,
  Save,
  X,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/forms/Input";
import { Button } from "@/components/forms/Button";
import { useProductStore } from "@/store/productStore";
import { productSchema, type ProductFormData } from "@/utils/validations";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export const ProdutosPage: React.FC = () => {
  const { products, isLoading, error, fetch, add, update, remove } =
    useProductStore();

  useEffect(() => {
    fetch(0, 10);
  }, [fetch]);

  const {
    register: createRegister,
    handleSubmit: handleCreateSubmit,
    formState: { errors: createErrors },
    reset: createReset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const {
    register: editRegister,
    setValue: editSetValue,
    getValues: editGetValues,
    trigger: editTrigger,
    formState: { errors: editErrors },
    reset: editReset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [removeOpen, setRemoveOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [products, query]);

  const onCreate = async (data: ProductFormData) => {
    const ok = await add({
      name: data.name,
      description: data.description,
      price: data.price,
      quantity: data.quantity,
    });
    if (ok) {
      toast({
        title: "Produto cadastrado com sucesso!",
        description: `${data.name} foi adicionado ao catálogo.`,
      });
      createReset();
    } else {
      toast({
        title: "Erro ao cadastrar produto",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const openEdit = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    setEditingId(id);
    editReset();
    editSetValue("name", p.name);
    editSetValue("description", p.description);
    editSetValue("price", p.price);
    editSetValue("quantity", p.quantity);
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    const isValid = await editTrigger([
      "name",
      "description",
      "price",
      "quantity",
    ]);
    if (!isValid) {
      toast({
        title: "Dados inválidos",
        description: "Verifique os campos antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    const values: ProductFormData = {
      name: editGetValues("name"),
      description: editGetValues("description"),
      price: editGetValues("price"),
      quantity: editGetValues("quantity"),
    } satisfies ProductFormData;

    const ok = await update(Number(editingId), values);
    if (ok) {
      toast({
        title: "Produto atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
      setEditOpen(false);
    } else {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  const handleRemove = async () => {
    if (!removingId) return;
    const ok = await remove(Number(removingId));
    if (ok) {
      toast({
        title: "Produto removido!",
        description: "O item foi excluído do catálogo.",
      });
    } else {
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o produto.",
        variant: "destructive",
      });
    }
    setRemoveOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      <main className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-gray-100">
              Gerenciar Produtos
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Cadastre e gerencie seus produtos de forma eficiente.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar produto..."
                className="pl-10 pr-3 h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => fetch(0, 10)}
              disabled={isLoading}
            >
              <RefreshCcw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </motion.div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 p-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex items-center">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                <Plus className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Cadastrar Produto
              </h2>
            </div>

            <form
              onSubmit={handleCreateSubmit(onCreate)}
              className="p-4 sm:p-6 space-y-4 sm:space-y-6"
            >
              <Input
                {...createRegister("name")}
                label="Nome do Produto"
                placeholder="Digite o nome do produto"
                error={createErrors.name?.message}
              />

              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  {...createRegister("description")}
                  rows={3}
                  className="flex w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Descreva o produto..."
                />
                {createErrors.description && (
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-2">
                    {createErrors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  {...createRegister("price")}
                  type="text"
                  label="Preço (R$)"
                  placeholder="0,00"
                  error={createErrors.price?.message}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    const numericValue = (Number(rawValue) / 100).toFixed(2);
                    e.target.value = numericValue
                      .replace(".", ",")
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                  }}
                  onBlur={(e) => {
                    // Quando enviar para o backend, converte para número
                    const formatted = e.target.value
                      .replace(/\./g, "")
                      .replace(",", ".");
                    createRegister("price").onChange({
                      target: { name: "price", value: parseFloat(formatted) },
                    });
                  }}
                />

                <Input
                  {...createRegister("quantity", { valueAsNumber: true })}
                  type="number"
                  label="Quantidade"
                  placeholder="0"
                  error={createErrors.quantity?.message}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Produto
              </Button>
            </form>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex items-center">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Produtos Cadastrados ({filtered.length})
              </h2>
            </div>

            <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 sm:p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="p-4 border rounded-lg border-gray-200 dark:border-gray-700"
                    >
                      <Skeleton className="h-4 w-48 mb-2" />
                      <Skeleton className="h-4 w-full mb-3" />
                      <div className="grid grid-cols-3 gap-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-6 text-center">
                  <Package className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                    Nenhum produto encontrado.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Cadastre um produto ou ajuste sua busca.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filtered.map((product) => (
                    <div key={product.id} className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base">
                            {product.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 break-words">
                            {product.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3">
                            <span className="text-base sm:text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(product.price)}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              Quantidade: {product.quantity}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                              Cadastrado em:{" "}
                              {(() => {
                                const d =
                                  product.createdAt instanceof Date
                                    ? product.createdAt
                                    : new Date(product.createdAt);
                                return isNaN(d.getTime())
                                  ? "-"
                                  : d.toLocaleDateString("pt-BR");
                              })()}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => openEdit(product.id)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => {
                              setRemovingId(product.id);
                              setRemoveOpen(true);
                            }}
                            title="Remover"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">
              Editar produto
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              {...editRegister("name")}
              label="Nome"
              placeholder="Nome do produto"
              error={editErrors.name?.message}
            />
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                Descrição
              </label>
              <textarea
                {...editRegister("description")}
                rows={3}
                className="flex w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva o produto..."
              />
              {editErrors.description && (
                <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-2">
                  {editErrors.description.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                {...editRegister("price")}
                type="text"
                label="Preço (R$)"
                placeholder="0,00"
                error={editErrors.price?.message}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, "");
                  const numericValue = (Number(rawValue) / 100).toFixed(2);
                  e.target.value = numericValue
                    .replace(".", ",")
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                }}
                onBlur={(e) => {
                  // Quando enviar para o backend, converte para número
                  const formatted = e.target.value
                    .replace(/\./g, "")
                    .replace(",", ".");
                  editRegister("price").onChange({
                    target: { name: "price", value: parseFloat(formatted) },
                  });
                }}
              />

              <Input
                {...editRegister("quantity", { valueAsNumber: true })}
                type="number"
                label="Quantidade"
                error={editErrors.quantity?.message}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleUpdate} className="gap-2">
              <Save className="h-4 w-4" />
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <AlertDialogContent className="dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-gray-100">
              Deseja remover este produto?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-gray-700 dark:text-gray-100">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
