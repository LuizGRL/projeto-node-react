import request from "supertest";
import { hash } from "bcryptjs";
import { server } from "../../src/shared/infra/http/server";
import { prisma } from "../../prisma";
import { ERole } from "../../src/modules/accounts/entities/enums/ERole";

describe("Book Routes Integration", () => {
  let adminToken: string;
  let publisherId: string;
  let authorId: string;
  let categoryId: string;

  beforeEach(async () => {
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.category.deleteMany();
    await prisma.publisher.deleteMany();
    await prisma.account.deleteMany();

    const passwordHash = await hash("admin123", 8);
    await prisma.account.create({
      data: {
        firstName: "Admin",
        lastName: "Book",
        email: "admin.book@test.com",
        password: passwordHash,
        cpf: "777.777.777-77",
        birthDate: new Date(),
        role: ERole.ADMIN,
        token_version: 1
      }
    });

    const resLogin = await request(server).post("/accounts/login").send({
        email: "admin.book@test.com",
        password: "admin123"
    });
    adminToken = resLogin.body.token;
    
    const pub = await prisma.publisher.create({
        data: { name: "O'Reilly", city: "Sebastopol", country: "USA" }
    });
    publisherId = pub.id;

    const auth = await prisma.author.create({
        data: { firstName: "Robert", lastName: "Martin" }
    });
    authorId = auth.id;

    const cat = await prisma.category.create({
        data: { name: "Engenharia de Software" }
    });
    categoryId = cat.id;
  });

  afterAll(async () => {
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.category.deleteMany();
    await prisma.publisher.deleteMany();
    await prisma.account.deleteMany();
    await prisma.$disconnect();
  });

  describe("POST /books/create", () => {
    it("deve criar um livro com todas as relações (ADMIN)", async () => {
      const response = await request(server)
        .post("/books/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Clean Code",
          isbn: "978-0132350884",
          pages: 464,
          quantityTotal: 10,
          quantityAvailable: 10,
          description: "A Handbook of Agile Software Craftsmanship",
          publicationDate: new Date(),
          coverUrl: "http://img.com/cover.jpg",
          publisherId: publisherId,
          
          authorIds: [authorId],     
          
          categoryIds: [categoryId]
        });


      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe("Clean Code");
    });
  });

  describe("GET /books/list", () => {
    it("deve listar os livros cadastrados", async () => {
      await prisma.book.create({
        data: {
          title: "The Pragmatic Programmer",
          isbn: "978-0201616224",
          pages: 352,
          quantityTotal: 5,
          quantityAvailable: 5,
          description: "From Journeyman to Master",
          publicationDate: new Date(),
          coverUrl: "http://img.com/pragmatic.jpg",
          publisherId: publisherId,
          authors: { connect: [{ id: authorId }] },
          categories: { connect: [{ id: categoryId }] }
        }
      });

      const response = await request(server)
        .get("/books/list")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("GET /books/getById", () => {
    it("deve buscar um livro pelo ID (enviado no Body)", async () => {
      const book = await prisma.book.create({
        data: {
          title: "Refactoring",
          isbn: "978-0201485677",
          pages: 431,
          quantityTotal: 3,
          quantityAvailable: 3,
          description: "Improving the Design of Existing Code",
          publicationDate: new Date(),
          coverUrl: "http://img.com/refactor.jpg",
          publisherId: publisherId,
          authors: { connect: [{ id: authorId }] },
          categories: { connect: [{ id: categoryId }] }
        }
      });

      const response = await request(server)
        .get("/books/getById")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ id: book.id });

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(book.id);
      expect(response.body.title).toBe("Refactoring");
    });
  });

  describe("PUT /books/update", () => {
    it("deve atualizar o título e quantidade do livro", async () => {
      const book = await prisma.book.create({
        data: {
          title: "Livro Antigo",
          isbn: "111-222-333",
          pages: 100,
          quantityTotal: 2,
          quantityAvailable: 2,
          description: "Desc",
          publicationDate: new Date(),
          coverUrl: "url",
          publisherId: publisherId,
          authors: { connect: [{ id: authorId }] },
          categories: { connect: [{ id: categoryId }] }
        }
      });

      const response = await request(server)
        .put("/books/update")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          id: book.id,
          title: "Livro Atualizado",
          quantityTotal: 20
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Livro Atualizado");
      expect(response.body.quantityTotal).toBe(20);
    });
  });

  describe("DELETE /books/delete", () => {
    it("deve deletar um livro existente", async () => {
      const book = await prisma.book.create({
        data: {
          title: "Livro Para Deletar",
          isbn: "999-888-777",
          pages: 50,
          quantityTotal: 1,
          quantityAvailable: 1,
          description: "Temp",
          publicationDate: new Date(),
          coverUrl: "url",
          publisherId: publisherId,
          authors: { connect: [{ id: authorId }] },
          categories: { connect: [{ id: categoryId }] }
        }
      });

      const response = await request(server)
        .delete("/books/delete")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ id: book.id });

      expect(response.status).toBe(200);

      const check = await prisma.book.findUnique({ where: { id: book.id }});
      expect(check).toBeNull();
    });
  });
});