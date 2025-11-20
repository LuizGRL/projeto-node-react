import { IncomingMessage } from "http";

export const parseBody = async (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        if (!body) {
          resolve({});
          return;
        }
        const json = JSON.parse(body);
        resolve(json);
      } catch (error) {
        console.error("Erro ao ler JSON:", error);
        resolve({});
      }
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
};