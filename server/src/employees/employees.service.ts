import { Injectable, NotFoundException, ConflictException, BadRequestException } from "@nestjs/common";
import { Employee, Prisma } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateEmployeeDto } from "@/employees/dto/create-employee.dto";
import { UpdateEmployeeDto } from "@/employees/dto/update-employee.dto";
import { ListEmployeesDto } from "@/employees/dto/list-employees.dto";

export interface PaginatedEmployees {
  items: Employee[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  // Create an employee.
  // `code` must be unique among active employees.
  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const existing = await this.prisma.employee.findFirst({
      where: { code: dto.code, deletedAt: null },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException(`There's an employee with the code "${dto.code}"`);
    }
    return this.prisma.employee.create({ data: dto });
  }

  // paginated, filtered, sorted list of active employees.
  // I use a transaction to count and find the employees to ensure that the total count is consistent with the items returned.
  async list(query: ListEmployeesDto): Promise<PaginatedEmployees> {
    const { page, pageSize, search, department, occupation, dateOfEmployment, terminationDate, orderBy, sortOrder } = query;

    //Simulating a delay of 5 seconds to test the loading state in the frontend.
    const timeout = 1000;
    await new Promise((resolve) => setTimeout(resolve, timeout));

    const where: Prisma.EmployeeWhereInput = {
      deletedAt: null,
      // filter by department if provided
      ...(department && { department }),
      // filter by occupation if provided
      ...(occupation && { occupation }),
      // filter by date of employment if provided
      ...(dateOfEmployment && { dateOfEmployment: { gte: dateOfEmployment } }),
      // filter by termination date if provided
      ...(terminationDate && { terminationDate: { gte: terminationDate } }),
      // search by fullName or code if provided. This search is case-insensitive
      ...(search && {
        OR: [{ fullName: { contains: search } }, { code: { contains: search } }],
      }),
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.employee.count({ where }),
      this.prisma.employee.findMany({
        where,
        orderBy: { [orderBy]: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  // Find an employee by id. Only active employees are returned.
  // Throws an exception if the employee is not found.
  async findOne(id: number): Promise<Employee> {
    const employee = await this.prisma.employee.findFirst({
      where: { id, deletedAt: null },
    });
    if (!employee) {
      throw new NotFoundException(`Employee ${id} not found`);
    }
    return employee;
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    await this.findOne(id);
    // if the request payload is changing `code`, ensure that no other active employee already owns it.
    if (dto.code !== undefined) {
      const existing = await this.prisma.employee.findFirst({
        where: { code: dto.code, deletedAt: null, NOT: { id } },
        select: { id: true },
      });
      if (existing) {
        throw new ConflictException(`There's an employee with the code "${dto.code}"`);
      }
    }
    return this.prisma.employee.update({ where: { id }, data: dto });
  }

  // Soft delete an employee. It's marked as deletedAt. When deletedAt == null means the employee is active.
  // So the employee is deleted, but not in the database.
  async remove(id: number): Promise<{ success: true }> {
    await this.findOne(id);
    await this.prisma.employee.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { success: true };
  }
}
