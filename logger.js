const chalk = require("chalk");

function logRequest(req) {
  const timestamp = chalk.dim(`[${new Date().toISOString()}]`);
  const method = chalk.bold.green(req.method);
  console.log(`${timestamp} ${method} ${req.url}`);
}

module.exports = {
  logRequest,
};
