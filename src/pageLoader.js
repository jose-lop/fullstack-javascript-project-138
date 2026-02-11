import fs from "fs/promises";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";

// 🔹 1. Helpers de nombres
const makeFileName = (url) => {
  const { hostname, pathname } = new URL(url);

  const name = `${hostname}${pathname}`
    .replace(/\/$/, "")
    .replace(/[^a-zA-Z0-9]/g, "-");

  return `${name}.html`;
};

const makeFilesDirName = (fileName) => fileName.replace(".html", "_files");

// 🔹 2. Helper para extraer recursos (AQUÍ VA)
const getResources = (html) => {
  const $ = cheerio.load(html);

  const imgSrc = $("img")
    .map((_, el) => $(el).attr("src"))
    .get();

  const scriptSrc = $("script")
    .map((_, el) => $(el).attr("src"))
    .get();

  const linkHref = $("link")
    .map((_, el) => $(el).attr("href"))
    .get();

  return [...imgSrc, ...scriptSrc, ...linkHref].filter(Boolean);
};

// 🔹 3. Función principal
const pageLoader = (url, outputDir = process.cwd()) => {
  const fileName = makeFileName(url);
  const filePath = path.join(outputDir, fileName);

  const filesDirName = makeFilesDirName(fileName);
  const filesDirPath = path.join(outputDir, filesDirName);

  return axios
    .get(url)
    .then((response) => {
      const html = response.data;

      const resources = getResources(html);
      console.log(resources); // temporal para ver qué detecta

      return fs.writeFile(filePath, html);
    })
    .then(() => fs.mkdir(filesDirPath, { recursive: true }))
    .then(() => filePath);
};

export default pageLoader;
