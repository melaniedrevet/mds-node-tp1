const fs = require("fs");
const path = require("path");

function replaceVariables(pageContents, variables) {
  return Object.entries(variables).reduce((acc, [name, value]) => {
    acc = acc.replace(`\${${name}\}`, value);
    return acc;
  }, pageContents);
}

function renderNotFoundPage(req, res) {
  try {
    const pageContents = fs.readFileSync(path.resolve(__dirname, "404.html"));
    res.writeHead(404, { "Content-Type": "text/html" });
    res.write(pageContents);
    res.end();
  } catch (e) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.write("Error: page not found");
    res.end();
  }
}

function loadPage(pagePath) {
  return fs.readFileSync(`./pages/${pagePath}`, "utf-8");
}

function renderPage(req, res, name, variables) {
  try {
    const content = replaceVariables(loadPage(name), variables);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(content);
    res.end();
  } catch (e) {
    if (e.code === "ENOENT") {
      console.error(e);
      // the file doesn't exist, render a 404 page
      renderNotFoundPage(req, res);
    } else {
      // another error happened, re-throw it for the global error handler
      throw e;
    }
  }
}

// render the index page containing the list
function renderIndexPage(req, res) {
  const files = fs.readdirSync(path.resolve(__dirname, "pages"));

  const pages = files
    .filter((file) => file !== "index.html") // remove index page from the list
    .map((file) => `<li><a href="/${file}">${file.split(".")[0]}</a></li>`)
    .join("\n");

  renderPage(req, res, "index.html", {
    USER: req.parsedURL.searchParams.get("user") ?? "Utilisateur",
    PAGES: pages,
  });
}

module.exports = {
  renderPage,
  renderIndexPage,
  renderNotFoundPage,
};
