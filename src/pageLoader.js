import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Convierte una URL en un nombre de archivo válido
 * https://codica.la/cursos → codica-la-cursos.html
 */
const getFileNameFromUrl = (url) => {
  const { hostname, pathname } = new URL(url);
  const name = `${hostname}${pathname}`
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+$/, "");

  return `${name}.html`;
};

export default (url, outputDir = process.cwd()) => {
  const fileName = getFileNameFromUrl(url);
  const filePath = path.join(outputDir, fileName);

  return axios
    .get(url)
    .then((response) => fs.writeFile(filePath, response.data))
    .then(() => filePath);
};
