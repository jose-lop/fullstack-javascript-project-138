#!/usr/bin/env node

import { Command } from "commander";
import pageLoader from "../src/pageLoader.js";

const program = new Command();

program
  .name("page-loader")
  .description("Page loader utility")
  .version("1.0.0")
  .option("-o, --output [dir]", "output dir", process.cwd())
  .argument("<url>")
  .action((url, options) => {
    pageLoader(url, options.output)
      .then((filepath) => console.log(filepath))
      .catch((error) => {
        console.error(error.message);
        process.exit(1);
      });
  });

program.parse(process.argv);
