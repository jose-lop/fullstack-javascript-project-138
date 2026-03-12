import fs from "fs/promises";
import path from "path";
import axios from "axios";

const normalize = (url) => {
  const { hostname, pathname } = new URL(url);

  const name = `${hostname}${pathname}`
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/-$/, "");

  return `${name}.html`;
};

export default (url, outputDir = process.cwd()) => {
  const fileName = normalize(url);
  const filePath = path.join(outputDir, fileName);

  return axios
    .get(url)
    .then((response) => fs.writeFile(filePath, response.data))
    .then(() => filePath);
};
