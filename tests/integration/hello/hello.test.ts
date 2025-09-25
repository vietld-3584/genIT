import request from "supertest";
import { server } from "../server";

describe("GET /api/hello", () => {
  it("should return a greeting message", async () => {
    await request(server)
      .get("/api/hello")
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty("message", "Hello from APIs!");
        expect(res.body.env).toHaveProperty("DB_NAME", "example");
      });
  });
});

describe("POST /api/hello", () => {
  it("should return a greeting message", async () => {
    await request(server)
      .post("/api/hello")
      .send({ name: "John" })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty("message", "Data received from John");
      });
  });
});
