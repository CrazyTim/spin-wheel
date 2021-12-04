#!/usr/bin/env node
import esbuild from 'esbuild';

import { readFile } from 'fs/promises';
import * as util from './util.js';
import startWebServer from './serve.js';

const p = JSON.parse(
  await readFile(
    new URL('../package.json', import.meta.url)
  )
);

const entryPoint = process.argv.filter(i => i.startsWith('-entryPoint='))[0]?.substring(12);

const serveFlag = process.argv.includes('-serve');

const build = {
  'name': p.name,
  'version': p.version,
  'format': process.argv.includes('-iife') ? 'iife' : 'esm',
  'author': p.author,
  'date': util.dateFormat (new Date (), '%Y-%m-%d %H:%M:%S'),
};

await esbuild.build({
  entryPoints: [entryPoint],
  outfile: `dist/${p.name}-${build.format}.js`,
  bundle: true,
  minify: true,
  target: ['es6'],
  format: build.format,
  globalName: 'wheel', // This setting is only for IIFE format.
  watch: serveFlag,
  banner: {'js': `/**\n * Name: ${build.name} (${build.format.toUpperCase()}) v${build.version}\n * Author: ${build.author}\n * Date: ${build.date}\n */`},
})
.catch((error) => {
  console.error(error);
  process.exit(1);
});

if (serveFlag) startWebServer();
