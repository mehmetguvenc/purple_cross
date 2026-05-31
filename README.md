# Purple Cross

## Frontend

### Tech Stack

- Nuxt 4
- TypeScript
- PrimeVue (Aura theme)
- Tailwind CSS
- Zod
- date-fns

### Setup

All commands below run from `frontend/`.

```sh
cp .env.example .env
npm install
```

### Run

```sh
npm run dev   # http://localhost:8080
```

### Env

- `.env`: `NUXT_PUBLIC_API_BASE` (server runs at "http://localhost:3000/api", change port if needed)

## Server

### Tech Stack

- NestJS
- Prisma
- SQLite
- TypeScript

### Setup

All commands below run from `server/`.

```sh
cp .env.example .env
npm install
npx prisma migrate dev --name init   # creates the DB, applies migrations, seeds sample data
```

### Run

```sh
npm run dev   # http://localhost:3000/api
```

### Prisma

```sh
npm run prisma:migrate   # new migration after schema changes
npm run prisma:generate  # regen client
npm run prisma:seed      # seed the sample employee data from prisma/seed.ts
npm run prisma:studio    # DB browser at http://localhost:5555 (Prisma's tool, not a web app)
```

### Env

- `.env`: `DATABASE_URL`, `PORT`
