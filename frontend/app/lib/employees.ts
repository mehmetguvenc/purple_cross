import { api } from "@/lib/api";
import type { CreateEmployeeDto, Employee, ListEmployeesQuery, PaginatedEmployees, UpdateEmployeeDto } from "@/types/employee";

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
};
