import fs from "fs/promises";
import path from "path";
import axios from "axios";
import { URL } from "url";

const pageLoader = async (url, outputDir) => {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const parsedUrl = new URL(url);

    const filename = `${parsedUrl.hostname.replace(/\./g, "-")}.html`;
    const filepath = path.join(outputDir, filename);

    await fs.mkdir(outputDir, { recursive: true });

    await fs.writeFile(filepath, html);

    return filepath;
  } catch (error) {
    throw new Error(`Error downloading page: ${error.message}`);
  }
};

export default pageLoader;
