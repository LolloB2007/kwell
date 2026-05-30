import Fastify from "fastify";
import cors from "@fastify/cors";
import { catalogRoutes } from "./routes/catalog.js";
import { leadRoutes } from "./routes/leads.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: (process.env.WEB_ORIGIN ?? "http://localhost:3000").split(","),
});

app.get("/health", async () => ({ ok: true, mock: process.env.USE_MOCK !== "false" }));
await app.register(catalogRoutes);
await app.register(leadRoutes);

const port = Number(process.env.PORT ?? 4000);
app.listen({ port, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
