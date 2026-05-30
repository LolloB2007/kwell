import type { FastifyInstance } from "fastify";
import { listCategories, listProducts, getCategory, getProduct } from "../prestashop.js";

export async function catalogRoutes(app: FastifyInstance) {
  app.get("/categories", async () => ({ categories: await listCategories() }));

  app.get<{ Params: { slug: string } }>("/categories/:slug", async (req, reply) => {
    const cat = await getCategory(req.params.slug);
    if (!cat) return reply.code(404).send({ error: "not_found" });
    const products = await listProducts({ categoryId: cat.id, limit: 24 });
    return { category: cat, products };
  });

  app.get<{ Querystring: { category?: string; limit?: string } }>("/products", async (req) => {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const categoryId = req.query.category ? Number(req.query.category) : undefined;
    return { products: await listProducts({ categoryId, limit }) };
  });

  app.get<{ Params: { slug: string } }>("/products/:slug", async (req, reply) => {
    const p = await getProduct(req.params.slug);
    if (!p) return reply.code(404).send({ error: "not_found" });
    return { product: p };
  });
}
