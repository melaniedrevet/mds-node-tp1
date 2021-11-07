const fs = require("fs");
const path = require("path");
const { renderIndexPage, renderPage } = require("./render");

function parseURL(req) {
  return new URL(req.url, `${req.protocol}://${req.headers.host}/`);
}

// Handles contact form submissions and redirects the user to the index page
function handleContactForm(req, res) {
  let data = "";
  req.on("data", (chunk) => (data += chunk));
  req.on("end", () => {
    const postData = new URLSearchParams(data);
    // add current date to the form to save it too
    postData.set("date", new Date().toISOString());

    // save the form submission to a text file
    writeFormSubmission(postData);

    // redirect to the home page
    res.writeHead(302, { Location: "/" });
    res.end();
  });
}

function writeFormSubmission(form) {
  // create text representation of submitted form
  const formSubmission = Array.from(form.entries())
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  // write the form submission to the
  fs.appendFileSync(
    path.resolve(__dirname, "form-submissions.txt"),
    `Date: ${new Date().toISOString()}\n${formSubmission}\n\n`
  );
}

// handles all requests and routes them the the correct handler
function handle(req, res) {
  req.parsedURL = parseURL(req);

  const { pathname } = req.parsedURL;

  if (pathname === "/" || pathname === "/index.html") {
    // the index page is a listing of all available pages
    renderIndexPage(req, res);
  } else if (pathname === "/contact.html" && req.method === "POST") {
    // the contact form handling
    handleContactForm(req, res);
  } else {
    // all other pages are served from the file system
    renderPage(req, res, pathname, {});
  }
}

module.exports = {
  handle,
};
