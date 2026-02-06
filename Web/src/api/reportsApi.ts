import api from "./api";

export interface DashboardSummary {
  totalItems: number;
  lowStock: number;
  stockValue: number;
}

export const reportsApi = {
  async getSummary(): Promise<DashboardSummary> {
    return await api.get<DashboardSummary>("/reports/summary");
  },
};
