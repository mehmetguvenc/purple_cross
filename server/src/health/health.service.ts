import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";

// exposes GET /api/health to check if the server is healthy
export interface HealthResponse {
  status: "ok";
  timestamp: string;
  db: "ok" | "down";
}

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<HealthResponse> {
    let db: HealthResponse["db"] = "down";
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      db = "ok";
    } catch {
      db = "down";
    }

    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      db,
    };
  }
}
