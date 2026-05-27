import { Controller, Get } from "@nestjs/common";
import { HealthService, HealthResponse } from "@/health/health.service";

@Controller("health")
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  check(): Promise<HealthResponse> {
    return this.health.check();
  }
}
