import { createZodDto } from "nestjs-zod";
import { CreateEmployeeSchema } from "@/employees/dto/create-employee.dto";

// Update Schema is based on Create Schema with every field optional, so clients can update any field they want to.
export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();

export class UpdateEmployeeDto extends createZodDto(UpdateEmployeeSchema) {}
