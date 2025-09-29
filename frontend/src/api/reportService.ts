import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_URL_API_BACKEND || "http://localhost:5000/api";

export type ReportType = "Custom";
export type ReportFormat = "csv" | "pdf";

export interface ReportPayload {
  type: ReportType;
  email?: string;
  whatsapp?: string;
  preview?: boolean;
  name?: string;
  startDate?: string;
  endDate?: string;
  totalProdutos: number;
  valorTotal: number;
}

export interface ReportResponse {
  ok?: boolean;
  message?: string;
  fileUrl?: string;
}

export const reportService = {
  async generate(
    payload: ReportPayload,
    token?: string
  ): Promise<ReportResponse> {
    const res = await axios.post(`${BASE_URL}/reports/generate`, payload, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return res.data as ReportResponse;
  },
};
