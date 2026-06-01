import { api } from "@/lib/api";
import type { CreateEmployeeDto, Employee, ImportResult, ListEmployeesQuery, PaginatedEmployees, UpdateEmployeeDto } from "@/types/employee";

// Basic CRUD operations for employees
export const employees = {
  list: (query: ListEmployeesQuery = {}) =>
    api<PaginatedEmployees>("/employees", { query }),
  get: (id: number) =>
    api<Employee>(`/employees/${id}`),
  create: (body: CreateEmployeeDto) =>
    api<Employee>("/employees", { method: "POST", body }),
  update: (id: number, body: UpdateEmployeeDto) =>
    api<Employee>(`/employees/${id}/update`, { method: "POST", body }),
  remove: (id: number) =>
    api<{ success: true }>(`/employees/${id}/delete`, { method: "POST" }),
  importCsv: (csv: string) =>
    api<ImportResult>("/employees/import", { method: "POST", body: { csv } }),
  // Download URL; the browser fetches the CSV directly.
  exportUrl: (query: ListEmployeesQuery = {}) => {
    const search = new URLSearchParams(query as Record<string, string>).toString();
    const base = useRuntimeConfig().public.apiBase;
    return search ? `${base}/employees/export?${search}` : `${base}/employees/export`;
  },
};
