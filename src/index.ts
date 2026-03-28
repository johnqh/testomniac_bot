import { Hono } from "hono";
import { githubApp } from "./github.js";
import { registerWebhooks } from "./webhook.js";
import { config } from "./config.js";

registerWebhooks();

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }));

app.post("/webhook", async (c) => {
  const id = c.req.header("x-github-delivery") ?? "";
  const name = c.req.header("x-github-event") ?? "";
  const signature = c.req.header("x-hub-signature-256") ?? "";
  const body = await c.req.text();

  try {
    await githubApp.webhooks.verifyAndReceive({
      id,
      name: name as any,
      signature,
      payload: body,
    });
    return c.json({ ok: true });
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return c.json({ error: "Invalid webhook" }, 400);
  }
});

console.log(`testomniac_bot listening on port ${config.port}`);

export default {
  port: config.port,
  fetch: app.fetch,
};
