#!/usr/bin/env node

import { Command } from "commander";
import { generateCommitMessage } from "../src/index.js";
import { setApiKey } from "../src/config.js";
import chalk from "chalk";

const program = new Command();

program
  .name("cumauto")
  .description("AI-powered git commit message generator")
  .version("1.3.1");

program
  .command("config")
  .description("Configure Gemini API key")
  .argument("<key>", "Gemini API key")
  .action(async (key) => {
    await setApiKey(key);
    console.log(chalk.green("API key saved successfully"));
  });

program
  .command("generate", { isDefault: true })
  .description("Generate commit message")
  .option("-c, --commit", "Automatically commit with generated message")
  .action(async (options) => {
    try {
      const message = await generateCommitMessage(options.commit);
      if (!options.commit) {
        console.log("\nGenerated commit message:");
        console.log(chalk.cyan(message));
        console.log("\nUse this command to commit:");
        console.log(chalk.yellow(`git commit -m "${message}"`));
      }
    } catch (error) {
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

program.parse();
