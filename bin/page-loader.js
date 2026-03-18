#!/usr/bin/env node

import { Command } from "commander";
import pageLoader from "../src/index.js";
import { URL } from "url";

const program = new Command();

program
  .name("page-loader")
  .description("Page Loader utility")
  .version("1.0.0")
  .argument("<url>", "URL to download")
  .option("-o, --output <dir>", "output directory", process.cwd())
  .action(async (url, options) => {
    try {
      new URL(url);

      const filepath = await pageLoader(url, options.output);
      console.log(filepath);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
