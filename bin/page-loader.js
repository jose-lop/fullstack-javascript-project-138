#!/usr/bin/env node

import { Command } from "commander";
import pageLoader from "../src/pageLoader.js";

const program = new Command();

program
  .name("page-loader")
  .description("Page loader utility")
  .version("1.0.0")
  .argument("<url>")
  .option("-o, --output <dir>", "output dir", process.cwd())
  .action(async (url, options) => {
    try {
      const filePath = await pageLoader(url, options.output);
      console.log(filePath);
      process.exit(0); // explícito
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
