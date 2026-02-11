import fs from "fs/promises";
import path from "path";
import axios from "axios";

const makeFileName = (url) => {
  const { hostname, pathname } = new URL(url);

  const name = `${hostname}${pathname}`
    .replace(/\/$/, "")
    .replace(/[^a-zA-Z0-9]/g, "-");

  return `${name}.html`;
};

const makeFilesDirName = (fileName) => fileName.replace(".html", "_files");

const pageLoader = (url, outputDir = process.cwd()) => {
  const fileName = makeFileName(url);
  const filePath = path.join(outputDir, fileName);

  const filesDirName = makeFilesDirName(fileName);
  const filesDirPath = path.join(outputDir, filesDirName);

  return axios
    .get(url)
    .then((response) => fs.writeFile(filePath, response.data))
    .then(() => fs.mkdir(filesDirPath, { recursive: true }))
    .then(() => filePath);
};

export default pageLoader;
