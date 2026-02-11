import fs from "fs/promises";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";

// 🔹 Genera nombre del archivo HTML
const makeFileName = (url) => {
  const { hostname, pathname } = new URL(url);

  const name = `${hostname}${pathname}`
    .replace(/\/$/, "")
    .replace(/[^a-zA-Z0-9]/g, "-");

  return `${name}.html`;
};

// 🔹 Genera nombre de carpeta _files
const makeFilesDirName = (fileName) => fileName.replace(".html", "_files");

// 🔹 Extrae solo recursos locales
const getResources = (html, baseUrl) => {
  const $ = cheerio.load(html);
  const base = new URL(baseUrl);

  const resources = [
    ...$("img")
      .map((_, el) => $(el).attr("src"))
      .get(),
    ...$("script")
      .map((_, el) => $(el).attr("src"))
      .get(),
    ...$("link")
      .map((_, el) => $(el).attr("href"))
      .get(),
  ].filter(Boolean);

  return resources
    .map((resource) => new URL(resource, baseUrl))
    .filter((resourceUrl) => resourceUrl.hostname === base.hostname)
    .map((resourceUrl) => resourceUrl.href);
};

// 🔹 Función principal
const pageLoader = (url, outputDir = process.cwd()) => {
  const fileName = makeFileName(url);
  const filePath = path.join(outputDir, fileName);

  const filesDirName = makeFilesDirName(fileName);
  const filesDirPath = path.join(outputDir, filesDirName);

  return axios
    .get(url)
    .then((response) => {
      const html = response.data;

      // Detectar recursos locales
      const resources = getResources(html, url);

      // Temporal (puedes quitarlo luego)
      console.log(resources);

      return fs.writeFile(filePath, html);
    })
    .then(() => fs.mkdir(filesDirPath, { recursive: true }))
    .then(() => filePath);
};

export default pageLoader;
