import "reflect-metadata"; 
import "dotenv/config";
import http from "http";
import { AppError } from "../../errors/AppError";
import { accountsRoutes } from "./routes/acconts.rotes";

const server = http.createServer(async (req, res) => {
  const { url } = req;

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

    sendJson(404, { error: "Route not found" });

  } catch (err) {
    if (err instanceof AppError) {
      return sendJson(err.statusCode, { message: err.message });
    }
    console.error(err);
    return sendJson(500, { message: "Internal Server Error" });
  }
});

server.listen(4200, () => console.log("Server limpo e organizado rodando!"));