import { describe, it, expect, beforeEach, afterEach } from "vitest";
import supertest, { SuperTest, Test } from "supertest";
import { FastifyInstance } from "fastify";
import { createServer } from "../src/app";

describe("Book API Tests", () => {
  let server: FastifyInstance;
  let request: SuperTest<Test>;

  beforeEach(async () => {
    server = createServer();
    await server.listen();
    request = supertest(server.server);
  });

  afterEach(async () => {
    await server.close();
  });

  it("should create a new book", async () => {
    const newBook = { title: "1984", author: "George Orwell", year: 1949 };
    const response = await request.post("/books").send(newBook);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newBook);
    expect(response.body).toHaveProperty("id");
  });

  it("should retrieve all books", async () => {
    await request.post("/books").send({ title: "1984", author: "George Orwell", year: 1949 });

    const response = await request.get("/books");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should delete a book by ID", async () => {
    const newBook = { title: "1984", author: "George Orwell", year: 1949 };
    const createResponse = await request.post("/books").send(newBook);

    const deleteResponse = await request.delete(`/books/${createResponse.body.id}`);

    expect(deleteResponse.status).toBe(204);

    const getResponse = await request.get(`/books/${createResponse.body.id}`);
    expect(getResponse.status).toBe(404);
  });

  it("should return 404 for a non-existent book", async () => {
    const response = await request.get("/books/9999");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Book not found!");
  });

  it("should return 400 for invalid input", async () => {
    const response = await request.post("/books").send({ title: "1984" });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Title, author, and year are required!");
  });
});
