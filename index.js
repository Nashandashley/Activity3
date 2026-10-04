import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { analyzeContent, getTopWords } from './counter.js';

// ANSI escape codes for clean visual formatting
const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  dim: '\x1b[2m',
  reset: '\x1b[0m'
};

async function run() {
  const args = process.argv.slice(2);

  // Check for --top flag
  const topFlagIndex = args.indexOf('--top');
  const showTopWords = topFlagIndex !== -1;

  // Collect file targets from command line arguments
  const files = args.filter((arg) => arg !== '--top');

  if (files.length === 0) {
    console.log(`${colors.yellow}Usage:${colors.reset} npm start <file1> [file2...] [--top]`);
    console.log(`${colors.dim}Example:${colors.reset} npm start sample.txt --top`);
    process.exit(1);
  }

  for (const filePath of files) {
    try {
      const fullPath = resolve(filePath);
      const content = await readFile(fullPath, 'utf-8');

      const { linesCount, wordsCount, charactersCount, wordsMatches } = analyzeContent(content);

      console.log(`\n${colors.cyan}--- File: ${filePath} ---${colors.reset}`);
      console.log(`${colors.green}Lines:${colors.reset}      ${linesCount}`);
      console.log(`${colors.green}Words:${colors.reset}      ${wordsCount}`);
      console.log(`${colors.green}Characters:${colors.reset} ${charactersCount}`);

      if (showTopWords) {
        const topWords = getTopWords(wordsMatches, 5);
        console.log(`${colors.yellow}Top Words:${colors.reset}`);
        if (topWords.length === 0) {
          console.log(`  ${colors.dim}No words found${colors.reset}`);
        } else {
          topWords.forEach(([word, count], idx) => {
            console.log(`  ${idx + 1}. ${word}: ${count}`);
          });
        }
      }
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.error(`${colors.red}Error:${colors.reset} File '${filePath}' not found.`);
      } else {
        console.error(`${colors.red}Error processing '${filePath}':${colors.reset}`, err.message);
      }
    }
  }
}

run();