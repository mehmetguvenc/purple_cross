import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Every filter is optional and combined with `AND` in the service, equivalent to `SQL WHERE ... AND ...`.
export const ListEmployeesSchema = z.object({
  // Pagination
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  // Search
  search: z.string().trim().min(1).optional(),
  // Filter by department
  department: z.string().trim().min(1).optional(),
  // Filter by occupation
  occupation: z.string().trim().min(1).optional(),
  // Filter by date of employment
  dateOfEmployment: z.coerce.date().optional(),
  // Filter by termination date
  terminationDate: z.coerce.date().optional(),
  // Sorting
  orderBy: z.enum(["id", "fullName", "code", "department", "occupation", "dateOfEmployment", "terminationDate"]).default("id"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export class ListEmployeesDto extends createZodDto(ListEmployeesSchema) {}
