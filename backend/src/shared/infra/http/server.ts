import "reflect-metadata"; 
import "dotenv/config";
import http from "http";
import { AppError } from "../../errors/AppError";
import { accountsRoutes } from "./routes/accounts.rotes";
import { authorsRoutes } from "./routes/authors.rotes";
import { booksRoutes } from "./routes/books.rotes";
import { categoriesRoutes } from "./routes/categories.rotes";
import { publishersRoutes } from "./routes/publisher.rotes";

const server = http.createServer(async (req, res) => {
  const { url, method } = req;

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const sendJson = (code: number, data: any) => {
    res.writeHead(code, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  };

  try {
    if (url?.startsWith("/accounts") || url?.startsWith("/sessions")) {
      await accountsRoutes(req, res);

      if (!res.writableEnded) {
        return sendJson(404, { error: "Rota não encontrada dentro de /accounts" });
      }
      return;
    }

    if (url?.startsWith("/authors")) {
      await authorsRoutes(req, res);
      if (!res.writableEnded) {
        return sendJson(404, { error: "Rota não encontrada em authors" });
      }
      return;
    }

    if (url?.startsWith("/books")) {
      await booksRoutes(req, res);
      if (!res.writableEnded) {
        return sendJson(404, { error: "Rota não encontrada em books" });
      }
      return;
    }

    if (url?.startsWith("/categories")) {
      await categoriesRoutes(req, res);
      if (!res.writableEnded) {
        return sendJson(404, { error: "Rota não encontrada em categories" });
      }
      return;
    }

    if (url?.startsWith("/publishers")) {
      await publishersRoutes(req, res);
      if (!res.writableEnded) {
        return sendJson(404, { error: "Rota não encontrada em publishers" });
      }
      return;
    }

    sendJson(404, { error: "Route not found" });

  } catch (err) {
    if (err instanceof AppError) {
      return sendJson(err.statusCode, { message: err.message });
    }
    console.error(err);
    return sendJson(500, { message: "Internal Server Error" });
  }
});

if (process.env.NODE_ENV !== "test") {
  server.listen(4200, () => console.log("Server limpo e organizado rodando na porta 4200!"));
}

export { server };