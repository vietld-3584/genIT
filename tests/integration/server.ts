import { createServer } from "http";
import next from "next";
import { config } from "dotenv";

// Load test environment
config({ path: '.env.test' });

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

// Helper function to start server for testing
export const startTestServer = (port: number = 0): Promise<{ server: any; port: number }> => {
  return new Promise((resolve, reject) => {
    const testServer = server.listen(port, (err?: any) => {
      if (err) {
        reject(err);
      } else {
        const address = testServer.address();
        const actualPort = typeof address === 'object' && address ? address.port : port;
        resolve({ server: testServer, port: actualPort });
      }
    });
  });
};

// Helper to close server
export const closeTestServer = (server: any): Promise<void> => {
  return new Promise((resolve) => {
    server.close(() => {
      resolve();
    });
  });
};