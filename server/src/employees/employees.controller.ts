import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { EmployeesService, PaginatedEmployees } from "@/employees/employees.service";
import { CreateEmployeeDto } from "@/employees/dto/create-employee.dto";
import { UpdateEmployeeDto } from "@/employees/dto/update-employee.dto";
import { ListEmployeesDto } from "@/employees/dto/list-employees.dto";
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
