#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { fetchProblemData } from './scraper/index.js';
import { buildMarkdown } from './template.js';

const program = new Command();
const configPath = path.resolve('./gfg-sync.config.json');
const config = fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  : { apiEndpointTemplate: '', outputDir: './docs', solutionsDir: './solutions' };

program
  .command('add')
  .description('Fetch one problem and generate its markdown doc')
  .requiredOption('--url <url>', 'GFG problem URL')
  .requiredOption('--solution <path>', 'Path to your solution file')
  .option('--lang <lang>', 'Language for the code block', 'cpp')
  .option('--notes <notes>', 'Approach / complexity notes')
  .action(async (opts) => {
    const solutionCode = fs.readFileSync(opts.solution, 'utf-8');
    const problem = await fetchProblemData(opts.url, config);
    const md = buildMarkdown({
      problem,
      url: opts.url,
      solutionCode,
      lang: opts.lang,
      notes: opts.notes,
    });

    const slug =
      opts.url.match(/problems\/([a-z0-9-]+)/i)?.[1] ||
      path.basename(opts.solution, path.extname(opts.solution));
    const folder = path.join(config.outputDir, (problem.difficulty || 'unknown').toLowerCase());
    fs.mkdirSync(folder, { recursive: true });
    const outPath = path.join(folder, `${slug}.md`);
    fs.writeFileSync(outPath, md);

    updateRegistry(slug, { url: opts.url, solution: opts.solution, output: outPath, lang: opts.lang, notes: opts.notes });
    console.log(`Generated ${outPath}`);
  });

program
  .command('sync')
  .description('Regenerate markdown for every entry in problems.json')
  .action(async () => {
    const registryPath = './problems.json';
    const registry = fs.existsSync(registryPath)
      ? JSON.parse(fs.readFileSync(registryPath, 'utf-8'))
      : {};

    for (const [slug, entry] of Object.entries(registry)) {
      console.log(`Syncing ${slug}...`);
      const solutionCode = fs.readFileSync(entry.solution, 'utf-8');
      const problem = await fetchProblemData(entry.url, config);
      const md = buildMarkdown({
        problem,
        url: entry.url,
        solutionCode,
        lang: entry.lang || 'cpp',
        notes: entry.notes,
      });
      const folder = path.join(config.outputDir, (problem.difficulty || 'unknown').toLowerCase());
      fs.mkdirSync(folder, { recursive: true });
      fs.writeFileSync(path.join(folder, `${slug}.md`), md);
    }
    console.log('Sync complete');
  });

function updateRegistry(slug, entry) {
  const registryPath = './problems.json';
  const registry = fs.existsSync(registryPath)
    ? JSON.parse(fs.readFileSync(registryPath, 'utf-8'))
    : {};
  registry[slug] = entry;
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
}

program.parse();
