import { Body, Controller, Get, Header, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { EmployeesService, PaginatedEmployees, ImportSummary } from "@/employees/employees.service";
import { CreateEmployeeDto } from "@/employees/dto/create-employee.dto";
import { UpdateEmployeeDto } from "@/employees/dto/update-employee.dto";
import { ListEmployeesDto } from "@/employees/dto/list-employees.dto";
import { ImportEmployeesDto } from "@/employees/dto/import-employees.dto";
import { Employee } from "@prisma/client";

// CRUD operations for employees. Body/query/path validation is handled by the global ZodValidationPipe in main.ts.
@Controller("employees")
export class EmployeesController {
  constructor(private readonly employees: EmployeesService) {}

  // Create an employee
  @Post()
  create(@Body() dto: CreateEmployeeDto): Promise<Employee> {
    return this.employees.create(dto);
  }

  // List of employees (paginated, filtered, sorted)
  @Get()
  list(@Query() query: ListEmployeesDto): Promise<PaginatedEmployees> {
    return this.employees.list(query);
  }

  // Export the filtered list as a CSV download.
  // Declared before the ":id" route so "/employees/export" isn't captured by the numeric id param.
  @Get("export")
  @Header("Content-Type", "text/csv; charset=utf-8")
  @Header("Content-Disposition", 'attachment; filename="employees.csv"')
  exportCsv(@Query() query: ListEmployeesDto): Promise<string> {
    return this.employees.exportCsv(query);
  }

  // Import employees from a CSV upload, upserting by code
  @Post("import")
  importCsv(@Body() dto: ImportEmployeesDto): Promise<ImportSummary> {
    return this.employees.importCsv(dto.csv);
  }

  // Retrieve an employee by id
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Promise<Employee> {
    return this.employees.findOne(id);
  }

  // Update an employee by id
  @Post(":id/update")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateEmployeeDto): Promise<Employee> {
    return this.employees.update(id, dto);
  }

  // Delete an employee (marked as deleted)
  @Post(":id/delete")
  remove(@Param("id", ParseIntPipe) id: number): Promise<{ success: true }> {
    return this.employees.remove(id);
  }
}
