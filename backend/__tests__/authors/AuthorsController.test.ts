import request from "supertest";
import { hash } from "bcryptjs";
import { server } from "../../src/shared/infra/http/server";
import { prisma } from "../../prisma";
import { ERole } from "../../src/modules/accounts/entities/enums/ERole";

describe("Author Routes Integration", () => {
  let adminToken: string;

  beforeEach(async () => {
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.account.deleteMany();

    const passwordHash = await hash("admin123", 8);
    
    await prisma.account.create({
      data: {
        firstName: "Admin",
        lastName: "Author",
        email: "admin.author@test.com",
        password: passwordHash,
        cpf: "999.999.999-99",
        birthDate: new Date(),
        role: ERole.ADMIN,
        token_version: 1
      }
    });

    const response = await request(server).post("/accounts/login").send({
        email: "admin.author@test.com",
        password: "admin123"
    });

    adminToken = response.body.token;
  });

  afterAll(async () => {
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.account.deleteMany();
    await prisma.$disconnect();
  });

  describe("POST /authors/create", () => {
    it("deve criar um novo autor (ADMIN)", async () => {
      const response = await request(server)
        .post("/authors/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          firstName: "Stephen",
          lastName: "King"
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.firstName).toBe("Stephen");
      expect(response.body.lastName).toBe("King");
    });

    it("deve retornar 401 se token não for fornecido", async () => {
      const response = await request(server)
        .post("/authors/create")
        .send({
          firstName: "Sem",
          lastName: "Auth"
        });

      expect(response.status).toBe(401);
    });
  });

  describe("GET /authors/list", () => {
    it("deve listar todos os autores", async () => {
      // Seed de dados
      await prisma.author.createMany({
        data: [
            { firstName: "George", lastName: "Orwell" },
            { firstName: "Isaac", lastName: "Asimov" }
        ]
      });

      const response = await request(server)
        .get("/authors/list")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body[0]).toHaveProperty("firstName");
    });
  });

  describe("GET /authors/getById", () => {
    it("deve buscar um autor específico pelo ID", async () => {
      const author = await prisma.author.create({
        data: { firstName: "J.K.", lastName: "Rowling" }
      });

      const response = await request(server)
        .get("/authors/getById")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ id: author.id });

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(author.id);
      expect(response.body.lastName).toBe("Rowling");
    });
  });

  describe("PUT /authors/update", () => {
    it("deve atualizar um autor existente", async () => {
      const author = await prisma.author.create({
        data: { firstName: "Agatha", lastName: "Cristie" }
      });

      const response = await request(server)
        .put("/authors/update")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          id: author.id,
          firstName: "Agatha",
          lastName: "Christie"
        });

      expect(response.status).toBe(200);
      expect(response.body.lastName).toBe("Christie");
    });
  });

  describe("DELETE /authors/delete", () => {
    it("deve deletar um autor", async () => {
      const author = await prisma.author.create({
        data: { firstName: "Autor", lastName: "Deletavel" }
      });

      const response = await request(server)
        .delete("/authors/delete")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ id: author.id });

      expect(response.status).toBe(200);

      const check = await prisma.author.findUnique({ where: { id: author.id }});
      expect(check).toBeNull();
    });
  });
});