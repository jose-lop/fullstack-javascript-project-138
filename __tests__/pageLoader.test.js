import fs from "fs/promises";
import os from "os";
import path from "path";
import nock from "nock";
import pageLoader from "../src/pageLoader.js";

test("downloads page", async () => {
  const html = "<h1>Hello</h1>";

  nock("https://example.com").get("/").reply(200, html);

  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "page-loader-"));

  const filePath = await pageLoader("https://example.com", dir);

  const content = await fs.readFile(filePath, "utf-8");

  expect(content).toBe(html);
});
