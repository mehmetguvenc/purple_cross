import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Raw CSV text; parsed in the service.
export const ImportEmployeesSchema = z.object({
  csv: z.string().min(1),
});

export class ImportEmployeesDto extends createZodDto(ImportEmployeesSchema) {}
