import { AuthService } from "../../src/services/AuthService";

describe("AuthService - Login", () => {
  it("deve lançar erro se o usuário não existir", async () => {
    const auth = new AuthService();

    await expect(auth.login("naoexiste@test.com", "1234"))
      .rejects
      .toThrow("Usuário não encontrado");
  });
});
