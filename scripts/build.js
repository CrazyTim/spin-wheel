#!/usr/bin/env node
import esbuild from 'esbuild';
import {readFile} from 'fs/promises';
import * as util from './util.js';
import * as browsersync from 'browser-sync';

function startWebServer (startPath) {

  browsersync.create();

  browsersync.init({
    server: '.',
    startPath: startPath,
    watch: true,
    notify: false,
    ignore: [
      './bin/*.*',
      './src/*.*', // esbuild is monitoring this folder.
      ],
  });

}

const p = JSON.parse(
  await readFile(
    new URL('../package.json', import.meta.url)
  )
);

const entryPoint = process.argv.filter(i => i.startsWith('-entryPoint='))[0]?.substring(12);
const serveFlag = process.argv.includes('-serve');
const format = process.argv.includes('-iife') ? 'iife' : 'esm';

const preamble = [
  `/**\n`,
  ` * ${p.name} (${format.toUpperCase()}) v${p.version}\n`,
  ` * ${p.homepage}\n`,
  ` * Copyright (c) ${p.author} ${util.dateFormat (new Date (), '%Y')}.\n`,
  ` * Distributed under the MIT License.\n`,
  ` */`,
];

await esbuild.build({
  entryPoints: [entryPoint],
  outfile: `dist/${p.name}-${format}.js`,
  bundle: true,
  minify: true,
  target: ['es6'],
  format: format,
  globalName: 'wheel', // This setting is only for IIFE format.
  watch: serveFlag,
  banner: {'js': preamble.join('')},
})
.catch((error) => {
  console.error(error);
  process.exit(1);
});

if (serveFlag) startWebServer('examples/themes');
