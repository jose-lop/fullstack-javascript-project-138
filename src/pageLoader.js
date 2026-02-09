import axios from "axios";
import fs from "fs/promises";
import path from "path";

export default (url, outputDir) => {
  const filePath = path.join(outputDir, "index.html");

  return axios
    .get(url)
    .then((response) => fs.writeFile(filePath, response.data))
    .then(() => filePath);
};
