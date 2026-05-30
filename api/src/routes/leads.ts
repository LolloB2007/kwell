import type { FastifyInstance } from "fastify";
import type { Lead } from "../types.js";

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function leadRoutes(app: FastifyInstance) {
  app.post<{ Body: Partial<Lead> }>("/leads", async (req, reply) => {
    const b = req.body ?? {};
    if (!b.name || !b.email || !isEmail(b.email) || !b.type) {
      return reply.code(400).send({ error: "invalid_lead" });
    }
    req.log.info({ lead: { type: b.type, email: b.email, company: b.company } }, "lead received");
    // TODO: forward to CRM / email service
    return { ok: true };
  });
}
