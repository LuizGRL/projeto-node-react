import request from "supertest";
import { hash } from "bcryptjs";
import { server } from "../../src/shared/infra/http/server";
import { prisma } from "../../prisma";
import { ERole } from "../../src/modules/accounts/entities/enums/ERole";

describe("Category Routes Integration", () => {
  let adminToken: string;

  beforeEach(async () => {
    await prisma.book.deleteMany();
    await prisma.category.deleteMany();
    await prisma.account.deleteMany();

    const passwordHash = await hash("admin123", 8);
    
    await prisma.account.create({
      data: {
        firstName: "Admin",
        lastName: "Category",
        email: "admin.cat@test.com",
        password: passwordHash,
        cpf: "888.888.888-88",
        birthDate: new Date(),
        role: ERole.ADMIN,
        token_version: 1
      }
    });

    const response = await request(server).post("/accounts/login").send({
        email: "admin.cat@test.com",
        password: "admin123"
    });

    if (response.status !== 200) {
        console.error("Erro no Login do Setup:", response.body);
    }
    adminToken = response.body.token;
  });

  afterAll(async () => {
    await prisma.book.deleteMany();
    await prisma.category.deleteMany();
    await prisma.account.deleteMany();
    await prisma.$disconnect();
  });

  describe("POST /categories/create", () => {
    it("deve criar uma nova categoria (ADMIN)", async () => {
      const response = await request(server)
        .post("/categories/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Tecnologia",
        });


      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe("Tecnologia");
    });

    it("deve retornar 409 se criar categoria com nome duplicado", async () => {
      await prisma.category.create({
        data: { name: "Terror" }
      });

      const response = await request(server)
        .post("/categories/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Terror",
          description: "Tentativa duplicada"
        });

      expect(response.status).toBe(409);
    });

    it("deve retornar 401 se token não for fornecido", async () => {
      const response = await request(server)
        .post("/categories/create")
        .send({ name: "Sem Auth" });

      expect(response.status).toBe(401);
    });
  });

  describe("GET /categories/list", () => {
    it("deve listar todas as categorias", async () => {
      await prisma.category.createMany({
        data: [
            { name: "Romance" },
            { name: "Ficção" }
        ]
      });

      const response = await request(server)
        .get("/categories/list")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body[0]).toHaveProperty("name");
    });
  });

  describe("GET /categories/findById", () => {
    it("deve buscar uma categoria específica pelo ID enviado no body", async () => {
      const category = await prisma.category.create({
        data: { name: "História" }
      });

      const response = await request(server)
        .get("/categories/findById")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ id: category.id });

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(category.id);
      expect(response.body.name).toBe("História");
    });

    it("deve retornar 404 se categoria não existir", async () => {
      const uuidFalso = "5f2d1130-1c05-4b0d-85f0-612301386701";
      
      const response = await request(server)
        .get("/categories/findById")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ id: uuidFalso });

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /categories/update", () => {
    it("deve atualizar uma categoria existente", async () => {
      const category = await prisma.category.create({
        data: { name: "Matemática" }
      });

      const response = await request(server)
        .put("/categories/update")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          id: category.id,
          name: "Matemática Avançada",
          description: "Cálculos complexos"
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Matemática Avançada");
    });
  });

  describe("DELETE /categories/delete", () => {
    it("deve deletar uma categoria (ADMIN)", async () => {
      const category = await prisma.category.create({
        data: { name: "Categoria Temporária" }
      });

      const response = await request(server)
        .delete("/categories/delete")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ id: category.id }); 

      expect(response.status).toBe(200);

      const check = await prisma.category.findUnique({ where: { id: category.id }});
      expect(check).toBeNull();
    });
  });
});