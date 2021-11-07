const http = require("http");

const { logRequest } = require("./logger");
const router = require("./router");

const PORT = parseInt(process.env.PORT ?? "8080", 10);

function handleErrors(req, res, err) {
  console.error(err);

  res.writeHead(500, { "Content-Type": "text/plain" });
  res.write(`Error: ${err.message}`);
  res.end();
}

const server = http.createServer((req, res) => {
  try {
    logRequest(req);
    router.handle(req, res);
  } catch (err) {
    handleErrors(req, res, err);
  }
});

server.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});
