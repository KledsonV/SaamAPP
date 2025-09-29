// src/store/productStore.ts
import { create } from "zustand";
import { AxiosError } from "axios";
import { Product, ProductFormData } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { productService } from "@/api/productService";

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;

  page: number;
  size: number;
  totalElements: number;
  totalPages: number;

  fetch: (page?: number, size?: number) => Promise<void>;
  add: (data: ProductFormData) => Promise<boolean>;
  update: (id: number, data: ProductFormData) => Promise<boolean>;
  remove: (id: number) => Promise<boolean>;
  reset: () => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,

  fetch: async (page = get().page, size = get().size) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const res = await productService.list(page, size, { headers });
      const dto = res.data;

      const mapped: Product[] = (dto.content || []).map((p: any) => ({
        id: String(p.id),
        name: p.name,
        description: p.description,
        price: Number(p.price),
        quantity: Number(p.quantity),
        createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
      }));

      set({
        products: mapped,
        page: dto.page,
        size: dto.size,
        totalElements: dto.totalElements,
        totalPages: dto.totalPages,
        isLoading: false,
      });
    } catch (e) {
      const msg =
        (e as AxiosError)?.response?.data?.message ||
        "Falha ao carregar produtos";
      set({ error: msg, isLoading: false });
    }
  },

  add: async (payload) => {
    set({ error: null });
    try {
      const token = useAuthStore.getState().token;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      await productService.create(payload, { headers });
      await get().fetch(0, get().size); // refetch
      return true;
    } catch (e) {
      const msg =
        (e as AxiosError)?.response?.data?.message ||
        "Não foi possível criar o produto";
      set({ error: msg });
      return false;
    }
  },

  update: async (id, payload) => {
    set({ error: null });
    try {
      const token = useAuthStore.getState().token;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      await productService.update(id, payload, { headers });
      await get().fetch(get().page, get().size);
      return true;
    } catch (e) {
      const msg =
        (e as AxiosError)?.response?.data?.message ||
        "Não foi possível atualizar o produto";
      set({ error: msg });
      return false;
    }
  },

  remove: async (id) => {
    set({ error: null });
    try {
      const token = useAuthStore.getState().token;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      await productService.remove(id, { headers });
      await get().fetch(get().page, get().size);
      return true;
    } catch (e) {
      const msg =
        (e as AxiosError)?.response?.data?.message ||
        "Não foi possível remover o produto";
      set({ error: msg });
      return false;
    }
  },

  reset: () =>
    set({
      products: [],
      isLoading: false,
      error: null,
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
    }),
}));
