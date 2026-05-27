import { NestFactory } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { AppModule } from "@/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // every route lives under `/api` route
  app.setGlobalPrefix("api");

  // Zod handles every request body/query validation globally. invalid input is converted to a 400 before it ever reaches a controller.
  app.useGlobalPipes(new ZodValidationPipe());

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`Server is running at http://localhost:${port}/api`);
}

bootstrap();
