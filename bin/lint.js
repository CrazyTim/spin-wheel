#!/usr/bin/env node
import {ESLint} from "eslint";

export default async function lint() {

  const eslint = new ESLint({ fix: true });

  // Lint files:
  const results = await eslint.lintFiles(["./src/**/*.js", "./example/**/*.js"]);

  // Fix files:
  await ESLint.outputFixes(results);

  // Format and output the results:
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);
  console.log(resultText);

}
