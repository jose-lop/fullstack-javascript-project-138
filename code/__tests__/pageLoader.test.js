import fs from "fs/promises";
import path from "path";
import os from "os";
import nock from "nock";
import pageLoader from "../src/pageLoader.js";

let tmpDir;

const baseUrl = "https://codica.la";
const pagePath = "/cursos";
const imagePath = "/assets/professions/nodejs.png";

const htmlFixture = `
<!DOCTYPE html>
<html>
  <body>
    <img src="${imagePath}" />
  </body>
</html>
`;

const imageFixture = "fake image content";

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "page-loader-"));

  nock(baseUrl).get(pagePath).reply(200, htmlFixture);

  nock(baseUrl).get(imagePath).reply(200, imageFixture);
});

afterEach(() => {
  nock.cleanAll();
});

test("downloads page with image and modifies html", async () => {
  const filePath = await pageLoader(`${baseUrl}${pagePath}`, tmpDir);

  const fileName = "codica-la-cursos.html";
  const folderName = "codica-la-cursos_files";
  const imageName = "codica-la-assets-professions-nodejs.png";

  const expectedHtmlPath = path.join(tmpDir, fileName);
  const expectedImagePath = path.join(tmpDir, folderName, imageName);

  // 1️⃣ HTML existe
  await expect(fs.access(expectedHtmlPath)).resolves.toBeUndefined();

  // 2️⃣ Imagen existe
  await expect(fs.access(expectedImagePath)).resolves.toBeUndefined();

  // 3️⃣ HTML modificado
  const savedHtml = await fs.readFile(expectedHtmlPath, "utf-8");

  expect(savedHtml).toContain(`${folderName}/${imageName}`);
});

test("throws error when page returns 404", async () => {
  nock.cleanAll();

  nock(baseUrl).get(pagePath).reply(404);

  await expect(pageLoader(`${baseUrl}${pagePath}`, tmpDir)).rejects.toThrow();
});

test("throws error on network failure", async () => {
  nock.cleanAll();

  nock(baseUrl).get(pagePath).replyWithError("Network error");

  await expect(pageLoader(`${baseUrl}${pagePath}`, tmpDir)).rejects.toThrow();
});

test("throws error if resource fails to download", async () => {
  nock.cleanAll();

  nock(baseUrl).get(pagePath).reply(200, htmlFixture);

  nock(baseUrl).get(imagePath).reply(404);

  await expect(pageLoader(`${baseUrl}${pagePath}`, tmpDir)).rejects.toThrow();
});

test("throws error if output directory is invalid", async () => {
  await expect(
    pageLoader(`${baseUrl}${pagePath}`, "/invalid/path/forbidden"),
  ).rejects.toThrow();
});
