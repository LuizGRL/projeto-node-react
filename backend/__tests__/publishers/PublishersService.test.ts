import request from "supertest";
import { hash } from "bcryptjs";
import { server } from "../../src/shared/infra/http/server";
import { prisma } from "../../prisma";
import { ERole } from "../../src/modules/accounts/entities/enums/ERole";

describe("Publisher Routes Integration", () => {
  let adminToken: string;

  beforeEach(async () => {
    await prisma.book.deleteMany(); 
    await prisma.publisher.deleteMany();
    await prisma.account.deleteMany();

    const passwordHash = await hash("admin123", 8);
    
    await prisma.account.create({
      data: {
        firstName: "Admin",
        lastName: "Publisher",
        email: "admin.pub@test.com",
        password: passwordHash,
        cpf: "555.555.555-55",
        birthDate: new Date(),
        role: ERole.ADMIN,
        token_version: 1
      }
    });

    const response = await request(server).post("/accounts/login").send({
        email: "admin.pub@test.com",
        password: "admin123"
    });

    adminToken = response.body.token;
  });

  afterAll(async () => {
    await prisma.book.deleteMany();
    await prisma.publisher.deleteMany();
    await prisma.account.deleteMany();
    await prisma.$disconnect();
  });

  describe("POST /publishers/create", () => {
    it("deve criar uma nova editora com cidade e país (ADMIN)", async () => {
      const response = await request(server)
        .post("/publishers/create") 
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Editora Pearson",
          city: "London",
          country: "United Kingdom"
        });

      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe("Editora Pearson");
      expect(response.body.city).toBe("London");
    });

    it("deve retornar 401 se não enviar token", async () => {
      const response = await request(server)
        .post("/publishers/create")
        .send({ 
            name: "Editora Fantasma",
            city: "Unknown",
            country: "Unknown"
        });

      expect(response.status).toBe(401);
    });
  });

  describe("GET /publishers/list", () => {
    it("deve listar todas as editoras", async () => {
      await prisma.publisher.createMany({
        data: [
            { name: "Editora A", city: "São Paulo", country: "Brasil" },
            { name: "Editora B", city: "New York", country: "USA" }
        ]
      });

      const response = await request(server)
        .get("/publishers/list") 
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body[0]).toHaveProperty("city");
    });
  });

  describe("PUT /publishers/update", () => {
    it("deve atualizar os dados da editora", async () => {
      const publisher = await prisma.publisher.create({
        data: { 
            name: "Editora Velha", 
            city: "Rio de Janeiro", 
            country: "Brasil" 
        }
      });

      const response = await request(server)
        .put("/publishers/update") 
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          id: publisher.id,
          name: "Editora Nova",
          city: "Curitiba",
          country: "Brasil"
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Editora Nova");
      expect(response.body.city).toBe("Curitiba");
    });
  });

  describe("DELETE /publishers/delete", () => {
    it("deve deletar uma editora existente", async () => {
      const publisher = await prisma.publisher.create({
        data: { 
            name: "Editora para Deletar",
            city: "Lisboa",
            country: "Portugal"
        }
      });

      const response = await request(server)
        .delete("/publishers/delete") 
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ id: publisher.id }); 

      expect(response.status).toBe(200);

      const check = await prisma.publisher.findUnique({ where: { id: publisher.id }});
      expect(check).toBeNull();
    });
  });
});