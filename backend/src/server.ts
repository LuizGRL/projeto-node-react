import http from "node:http";

const server = http.createServer((req, res) => {
  res.end("Hello World");
});

server.listen(4200, () => {
  console.log("Server running on http://localhost:4200");
});
