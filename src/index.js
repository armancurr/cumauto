import simpleGit from "simple-git";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getApiKey } from "./config.js";
import chalk from "chalk";

const git = simpleGit();

async function checkGitRepo() {
  try {
    await git.revparse(["--is-inside-work-tree"]);
  } catch (error) {
    throw new Error("Not a git repository");
  }
}

async function getDiff() {
  const diff = await git.diff(["--staged"]);
  if (!diff) {
    throw new Error(
      "No staged changes found. Stage your changes using:\n" +
        "┌───────────────────────────────────────────────┐\n" +
        "│ git add                            OR         │\n" +
        "│ git add .                          OR         │\n" +
        "│ git add <file>                                │\n" +
        "└───────────────────────────────────────────────┘",
    );
  }
  return diff;
}

async function generateCommitMessage(autoCommit = false) {
  await checkGitRepo();
  const diff = await getDiff();

  const genAI = new GoogleGenerativeAI(getApiKey());
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

  const prompt = `Generate a concise, meaningful git commit message for the following changes. 
Follow the Conventional Commits format (type(scope): description). 
The message should be under 50 characters. And DO NOT include any other text.
Examples:
"""
feat(api): add user registration
Test(buyers): Fix tag remarks test
Fix(e2e): Reduce search delay
test(suppliers): remove smoke tag
feat: remove unused supplier pages
"""
Changes:
${diff}`;

  const result = await model.generateContent(prompt, {
    maxOutputTokens: 20,
    temperature: 0.6,
  });
  const message = result.response.text().trim();

  if (autoCommit) {
    await git.commit(message);
    console.log(chalk.green(`Committed with message: ${message}`));
  }

  return message;
}

export { generateCommitMessage };
