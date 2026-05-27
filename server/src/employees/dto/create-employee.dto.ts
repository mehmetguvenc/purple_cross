import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// single source of truth for the create payload
export const CreateEmployeeSchema = z.object({
  code: z.string().min(1).max(50),
  fullName: z.string().min(1).max(200),
  occupation: z.string().min(1).max(100),
  department: z.string().min(1).max(100),
  dateOfEmployment: z.coerce.date(),
  terminationDate: z.coerce.date().optional(),
});

export class CreateEmployeeDto extends createZodDto(CreateEmployeeSchema) {}
