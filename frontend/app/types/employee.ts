import { z } from "zod";
import type { Paginated } from "@/types/pagination";

// Same Employee shape the server returns. It needs to be updated when fields change in the server code
export interface Employee {
  id: number;
  code: string;
  fullName: string;
  occupation: string;
  department: string;
  dateOfEmployment: string | null;
  terminationDate: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// I write DTOs as Zod schemas so the same definition covers form validation and the API client's types.
export const createEmployeeSchema = z.object({
  code: z.string().trim().min(1, "Code is required"),
  fullName: z.string().trim().min(1, "Full name is required"),
  occupation: z.string().trim().min(1, "Occupation is required"),
  department: z.string().trim().min(1, "Department is required"),
  dateOfEmployment: z.string().optional(),
  terminationDate: z.string().optional(),
});
export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;

// The partial() method makes every field optional so the caller can update one field without resending the whole object
export const updateEmployeeSchema = createEmployeeSchema.partial();
export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>;

// List query params
export interface ListEmployeesQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  department?: string;
  occupation?: string;
  dateOfEmployment?: string;
  terminationDate?: string;
  orderBy?: "id" | "fullName" | "code" | "department" | "occupation" | "dateOfEmployment" | "terminationDate";
  sortOrder?: "asc" | "desc";
}

export type PaginatedEmployees = Paginated<Employee>;
