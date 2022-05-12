const fs = require("fs");
const http = require("http");
const port = 3000;
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const slugify = require("slugify");

const cardData = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const overviewData = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const productData = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
//function to replace template

const dataObj = JSON.parse(data);
// const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
dataObj.forEach((element, i, arr) => {
  arr[i].slug = slugify(element.productName, { lower: true });
});

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(cardData, el))
      .join("");
    const output = overviewData.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.writeHead(200, { "content-type": "text/html" });
    res.end(output);
  } else if (pathname.startsWith("/product")) {
    res.writeHead(200, { "content-type": "text/html" });

    const product = dataObj.find((el) => el.slug === pathname.split("/")[2]);
    const output = replaceTemplate(productData, product);
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page you are looking for does not exist</h1>");
  }
});
server.listen(port, () => {
  console.log(`Server is listening on port :`, port);
});
