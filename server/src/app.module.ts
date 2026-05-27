import { Module } from "@nestjs/common";
import { EmployeesModule } from "@/employees/employees.module";
import { HealthModule } from "@/health/health.module";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
  imports: [PrismaModule, HealthModule, EmployeesModule],
})
export class AppModule {}
