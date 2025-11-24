import { PrismaCategoriesRepository } from "../../src/modules/books/repositories/CategoriesRepository";
import { CategoryService } from "../../src/modules/books/services/CategoryService";
import { prisma } from "../../prisma";
import { UUID } from "crypto";

describe("CategoryService", () => {
  let categoryService: CategoryService;
  let categoriesRepository: PrismaCategoriesRepository;

  beforeEach(async () => {
    await prisma.book.deleteMany(); 
    await prisma.category.deleteMany();
    
    categoriesRepository = new PrismaCategoriesRepository();
    categoryService = new CategoryService(categoriesRepository);
  });

  afterAll(async () => {
    await prisma.category.deleteMany();
    await prisma.$disconnect();
  });

  test("deve criar uma categoria com sucesso", async () => {
    const category = await categoryService.create({ name: "Fantasia" });
    expect(category).toHaveProperty("id");
    expect(category.name).toBe("Fantasia");
  });

  test("não deve criar categoria com nome duplicado", async () => {
    await categoryService.create({ name: "Terror" });

    await expect(categoryService.create({ name: "Terror" }))
      .rejects.toMatchObject({
        message: "Categoria já existe",
        statusCode: 409,
      });
  });

  test("deve atualizar uma categoria com sucesso", async () => {
    const category = await categoryService.create({ name: "Drama" });
    
    const updated = await categoryService.update({
      id: category.id as UUID,
      name: "Drama e Suspense"
    });

    expect(updated.name).toBe("Drama e Suspense");
  });

  test("não deve atualizar categoria para um nome que já existe em outra", async () => {
    const cat1 = await categoryService.create({ name: "Romance" });
    const cat2 = await categoryService.create({ name: "Sci-Fi" });

    await expect(categoryService.update({
      id: cat1.id as UUID,
      name: "Sci-Fi"
    })).rejects.toMatchObject({
      message: "Já existe uma categoria com este nome",
      statusCode: 409,
    });
  });
});