import { createServer } from "http";
import next from "next";

const forceProd = process.env.NEXT_TEST_DEV === "false";
const app = next({
  dev: !forceProd,
  // turbopack only in dev mode
  ...(forceProd ? {} : { turbopack: true }),
});
const handle = app.getRequestHandler();

await app.prepare();

export const server = createServer((req, res) => {
  handle(req, res);
});
