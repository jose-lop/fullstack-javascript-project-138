import fs from "fs/promises";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";
import debug from "debug";

const log = debug("page-loader");

const normalize = (str) =>
  str
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/-$/, "");

const makeFileName = (url) => {
  const { hostname, pathname } = new URL(url);
  return `${normalize(`${hostname}${pathname}`)}.html`;
};

const makeFolderName = (fileName) => fileName.replace(".html", "_files");

const makeResourceName = (url) => {
  const { hostname, pathname } = new URL(url);
  const ext = path.extname(pathname);
  const nameWithoutExt = pathname.replace(ext, "");
  return `${normalize(`${hostname}${nameWithoutExt}`)}${ext}`;
};

const getLocalResources = ($, baseUrl) => {
  const baseHostname = new URL(baseUrl).hostname;

  const selectors = [
    { tag: "img", attr: "src" },
    { tag: "script", attr: "src" },
    { tag: "link", attr: "href" },
  ];

  return selectors.flatMap(({ tag, attr }) =>
    $(tag)
      .map((_, element) => {
        const value = $(element).attr(attr);
        if (!value) return null;

        const absoluteUrl = new URL(value, baseUrl);

        if (absoluteUrl.hostname !== baseHostname) return null;

        return {
          element,
          url: absoluteUrl.href,
          attr,
        };
      })
      .get()
      .filter(Boolean),
  );
};

const downloadResource = async (resource, folderPath, folderName, $) => {
  const resourceName = makeResourceName(resource.url);
  const resourcePath = path.join(folderPath, resourceName);

  try {
    const response = await axios.get(resource.url, {
      responseType: "arraybuffer",
    });

    if (response.status !== 200) {
      throw new Error(
        `Failed to download resource ${resource.url}: HTTP ${response.status}`,
      );
    }

    await fs.writeFile(resourcePath, response.data);

    $(resource.element).attr(resource.attr, `${folderName}/${resourceName}`);
  } catch (error) {
    throw new Error(
      `Error downloading resource ${resource.url}: ${error.message}`,
    );
  }
};

const pageLoader = async (url, outputDir = process.cwd()) => {
  log(`Starting download: ${url}`);

  const fileName = makeFileName(url);
  const filePath = path.join(outputDir, fileName);
  const folderName = makeFolderName(fileName);
  const folderPath = path.join(outputDir, folderName);

  log(`HTML will be saved as: ${filePath}`);
  log(`Resources folder: ${folderPath}`);

  try {
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`Failed to load page: HTTP ${response.status}`);
    }

    log("Page downloaded successfully");

    const $ = cheerio.load(response.data);
    const resources = getLocalResources($, url);

    log(`Found ${resources.length} local resources`);

    await fs.mkdir(folderPath, { recursive: true });
    log("Resources directory created");

    await Promise.all(
      resources.map((resource) => {
        log(`Downloading resource: ${resource.url}`);
        return downloadResource(resource, folderPath, folderName, $);
      }),
    );

    log("All resources downloaded");

    await fs.writeFile(filePath, $.html());

    log("HTML saved successfully");

    return filePath;
  } catch (error) {
    log(`Error occurred: ${error.message}`);
    throw error; // 🔥 IMPORTANTE
  }
};

export default pageLoader;
