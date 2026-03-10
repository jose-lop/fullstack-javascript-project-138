import fs from "fs/promises";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";
import Listr from "listr";

const pageLoader = async (url, outputDir = process.cwd()) => {
  // Validar directorio
  await fs.access(outputDir);

  // =========================
  // Helpers
  // =========================

  const normalize = (str) =>
    str
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/-$/, "");

  const makeFileName = (url) => {
    const { hostname, pathname } = new URL(url);
    const name = pathname === "/" ? "" : pathname;
    return `${normalize(`${hostname}${name}`)}.html`;
  };

  const makeFolderName = (fileName) => fileName.replace(".html", "_files");

  const makeResourceName = (url) => {
    const { hostname, pathname } = new URL(url);
    const ext = path.extname(pathname) || ".html";
    const nameWithoutExt = pathname.replace(ext, "");
    return `${normalize(`${hostname}${nameWithoutExt}`)}${ext}`;
  };

  const getLocalResources = ($, baseUrl) => {
    const tags = [
      { tag: "img", attr: "src" },
      { tag: "link", attr: "href" },
      { tag: "script", attr: "src" },
    ];

    const resources = [];

    tags.forEach(({ tag, attr }) => {
      $(tag).each((_, element) => {
        const resourceUrl = $(element).attr(attr);
        if (!resourceUrl) return;

        try {
          const absoluteUrl = new URL(resourceUrl, baseUrl);

          if (absoluteUrl.hostname === new URL(baseUrl).hostname) {
            resources.push({
              element,
              attr,
              url: absoluteUrl.href,
            });
          }
        } catch (e) {
          // ignorar URLs inválidas
        }
      });
    });

    return resources;
  };

  const downloadResource = async (resource, folderPath, folderName, $) => {
    const { url: resourceUrl, element, attr } = resource;

    const response = await axios.get(resourceUrl, {
      responseType: "arraybuffer",
    });

    const resourceName = makeResourceName(resourceUrl);
    const resourcePath = path.join(folderPath, resourceName);

    await fs.writeFile(resourcePath, response.data);

    $(element).attr(attr, `${folderName}/${resourceName}`);
  };

  // =========================
  // Paths
  // =========================

  const fileName = makeFileName(url);
  const filePath = path.join(outputDir, fileName);
  const folderName = makeFolderName(fileName);
  const folderPath = path.join(outputDir, folderName);

  const tasks = new Listr([
    {
      title: "Download page",
      task: async (context) => {
        const response = await axios.get(url);

        if (response.status !== 200) {
          throw new Error(`Request failed with status code ${response.status}`);
        }

        context.html = response.data;
      },
    },
    {
      title: "Download resources",
      task: async (context) => {
        const $ = cheerio.load(context.html);
        const resources = getLocalResources($, url);

        context.$ = $;

        if (resources.length > 0) {
          await fs.mkdir(folderPath, { recursive: true });

          await Promise.all(
            resources.map((resource) =>
              downloadResource(resource, folderPath, folderName, $),
            ),
          );
        }
      },
    },
    {
      title: "Save HTML",
      task: async (context) => {
        const $ = context.$ || cheerio.load(context.html);
        await fs.writeFile(filePath, $.html());
      },
    },
  ]);

  await tasks.run();

  return filePath;
};

export default pageLoader;
