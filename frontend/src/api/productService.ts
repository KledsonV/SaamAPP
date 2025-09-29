/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./axiosInstance";
import { ProductFormData } from "@/types";

export const productService = {
  list: (page = 0, size = 10, config?: any) =>
    api.get("/products", { params: { page, size }, ...(config || {}) }),

  getById: (id: number, config?: any) => api.get(`/products/${id}`, config),

  create: (payload: ProductFormData, config?: any) =>
    api.post("/products", payload, config),

  update: (id: number, payload: ProductFormData, config?: any) =>
    api.put(`/products/${id}`, payload, config),

  remove: (id: number, config?: any) => api.delete(`/products/${id}`, config),
};
