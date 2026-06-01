import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { Employee, Prisma } from "@prisma/client";
import Papa from "papaparse";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateEmployeeDto, CreateEmployeeSchema } from "@/employees/dto/create-employee.dto";
import { UpdateEmployeeDto } from "@/employees/dto/update-employee.dto";
import { ListEmployeesDto } from "@/employees/dto/list-employees.dto";

export interface PaginatedEmployees {
  items: Employee[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ImportSummary {
  created: number;
  updated: number;
  skipped: number;
}

// Day-only date for the CSV (YYYY-MM-DD).
function toDay(date: Date): string {
  return date.toISOString().slice(0, 10);
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

  // Shared by the list and the CSV export so both filter the same way.
  // Status filters are relative to "now".
  private buildWhere(query: ListEmployeesDto): Prisma.EmployeeWhereInput {
    const { search, department, occupation, employmentStatus, terminationStatus } = query;
    const now = new Date();

    return {
      deletedAt: null,
      // Partial, case-insensitive match (SQLite) so "eng" finds "Engineering".
      ...(department && { department: { contains: department } }),
      ...(occupation && { occupation: { contains: occupation } }),
      // Employment status: already started vs. starts in the future.
      ...(employmentStatus === "current" && { dateOfEmployment: { lte: now } }),
      ...(employmentStatus === "soon" && { dateOfEmployment: { gt: now } }),
      // Termination status: already terminated vs. scheduled to be.
      ...(terminationStatus === "terminated" && { terminationDate: { lte: now } }),
      ...(terminationStatus === "scheduled" && { terminationDate: { gt: now } }),
      // global keyword search across name, department and occupation (case-insensitive on SQLite).
      ...(search && {
        OR: [
          { fullName: { contains: search } },
          { department: { contains: search } },
          { occupation: { contains: search } },
        ],
      }),
    };
  }

  // paginated, filtered, sorted list of active employees.
  // I use a transaction to count and find the employees to ensure that the total count is consistent with the items returned.
  async list(query: ListEmployeesDto): Promise<PaginatedEmployees> {
    const { page, pageSize, orderBy, sortOrder } = query;
    const where = this.buildWhere(query);

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
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // All filtered employees as CSV (no pagination).
  async exportCsv(query: ListEmployeesDto): Promise<string> {
    const items = await this.prisma.employee.findMany({
      where: this.buildWhere(query),
      orderBy: { [query.orderBy]: query.sortOrder },
    });

    const rows = items.map((employee) => ({
      code: employee.code,
      fullName: employee.fullName,
      occupation: employee.occupation,
      department: employee.department,
      dateOfEmployment: toDay(employee.dateOfEmployment),
      terminationDate: employee.terminationDate ? toDay(employee.terminationDate) : "",
    }));

    return Papa.unparse(rows);
  }

  // Upsert each CSV row by `code`. Invalid rows are skipped.
  async importCsv(csv: string): Promise<ImportSummary> {
    const parsed = Papa.parse<Record<string, string>>(csv.trim(), {
      header: true,
      skipEmptyLines: true,
    });

    const summary: ImportSummary = { created: 0, updated: 0, skipped: 0 };

    const rows = parsed.data;
    for (const raw of rows) {
      // Blank cells arrive as ""; treat as missing so optional fields validate.
      const row = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, value === "" ? undefined : value]));
      const result = CreateEmployeeSchema.safeParse(row);
      if (!result.success) {
        summary.skipped++;
        continue;
      }

      const data = result.data;
      const existing = await this.prisma.employee.findFirst({
        where: { code: data.code, deletedAt: null },
        select: { id: true },
      });

      if (existing) {
        await this.prisma.employee.update({ where: { id: existing.id }, data });
        summary.updated++;
      } else {
        await this.prisma.employee.create({ data });
        summary.created++;
      }
    }

    return summary;
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
