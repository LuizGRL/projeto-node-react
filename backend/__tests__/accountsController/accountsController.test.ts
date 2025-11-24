import request from "supertest";
import { hash } from "bcryptjs";
import { ERole } from "../../src/modules/accounts/entities/enums/ERole";
import { server } from "../../src/shared/infra/http/server";
import { prisma } from "../../prisma"; 

describe("Account Routes Integration", () => {
  
  let adminToken: string;
  let userToken: string;
  let adminId: string;
  let userId: string;
  let userEmail: string;

  const PASSWORD_ADMIN = "AdminSenha@12341";
  const PASSWORD_USER = "UserSenha@12341";

  const CPF_ADMIN = "354.967.400-70"; 
  const CPF_USER = "370.687.120-37";

  beforeEach(async () => {
    await prisma.account.deleteMany();

    const adminPasswordHash = await hash(PASSWORD_ADMIN, 8);
    
    const admin = await prisma.account.create({
      data: {
        firstName: "Admin",
        lastName: "Super",
        email: "admin@test.com",
        password: adminPasswordHash,
        cpf: CPF_ADMIN, 
        birthDate: new Date(),
        role: ERole.ADMIN,
        token_version: 1
      }
    });
    adminId = admin.id;

    const resAdmin = await request(server).post("/accounts/login").send({
        email: "admin@test.com",
        password: PASSWORD_ADMIN 
    });

    if (resAdmin.status !== 200) {
        console.error(" FALHA LOGIN ADMIN:", resAdmin.body);
    }
    adminToken = resAdmin.body.token;

    const userPasswordHash = await hash(PASSWORD_USER, 8);
    
    const user = await prisma.account.create({
      data: {
        firstName: "User",
        lastName: "Normal",
        email: "user@test.com",
        password: userPasswordHash,
        cpf: CPF_USER,
        birthDate: new Date(),
        role: ERole.VISITOR,
        token_version: 1
      }
    });
    userId = user.id;
    userEmail = user.email;

    const resUser = await request(server).post("/accounts/login").send({
        email: "user@test.com",
        password: PASSWORD_USER
    });
    
    if (resUser.status !== 200) {
        console.error("FALHA LOGIN USER:", resUser.body);
    }
    userToken = resUser.body.token;
  });

  afterAll(async () => {
    await prisma.account.deleteMany();
    await prisma.$disconnect();
  });

  describe("POST /accounts/login", () => {
    it("deve retornar token quando credenciais estão corretas", async () => {
      const response = await request(server)
        .post("/accounts/login")
        .send({
          email: "admin@test.com",
          password: PASSWORD_ADMIN
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("deve retornar 401 com senha errada", async () => {
      const response = await request(server)
        .post("/accounts/login")
        .send({
          email: "admin@test.com",
          password: "senha_errada"
        });

      expect(response.status).toBe(401);
    });
  });

  describe("POST /accounts/create", () => {
    it("deve criar usuário se for ADMIN logado", async () => {
      const response = await request(server)
        .post("/accounts/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          firstName: "Novo",
          lastName: "Usuario",
          email: "novo.usuario@test.com",
          password: "SenhaForte123@",
          cpf: "782.770.660-66", 
          birthDate: "1990-01-01",
          role: "VISITOR"
        });

      if (response.status !== 201) console.log("Erro Create:", response.body);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
    });

    it("deve retornar 403 se for usuário comum (VISITOR)", async () => {
      const response = await request(server)
        .post("/accounts/create")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          firstName: "Hacker",
          lastName: "Tentando",
          email: "hacker@test.com",
          password: "SenhaForte123@",
          cpf: "307.055.160-24",
          birthDate: "1990-01-01",
          role: "ADMIN"
        });

      expect(response.status).toBe(403); 
    });
  });

  describe("PUT /accounts/updatePassword", () => {
    it("deve permitir que o usuário altere sua PRÓPRIA senha", async () => {
      const response = await request(server)
        .put("/accounts/updatePassword")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          email: userEmail,
          password: "NovaSenhaForte123@"
        });
      expect(response.status).toBe(200);
    });

    it("deve BLOQUEAR se usuário tentar mudar senha de outro", async () => {
      const response = await request(server)
        .put("/accounts/updatePassword")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          id: adminId,
          password: "hacked"
        });

      expect(response.status).toBe(403);
    });
  });
});