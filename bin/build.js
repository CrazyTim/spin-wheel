#!/usr/bin/env node

import esbuild from 'esbuild';
import * as browsersync from 'browser-sync';
import { readFile } from 'fs/promises';

const p = JSON.parse(
  await readFile(
    new URL('../package.json', import.meta.url)
  )
);

const entryPoint = process.argv.filter(i => i.startsWith('-entryPoint='))[0]?.substring(12);

const serve = process.argv.includes('-serve');

const build = {
  'name': p.name,
  'version': p.version,
  'format': process.argv.includes('-iife') ? 'iife' : 'esm',
  'author': p.author,
  'date': dateFormat (new Date (), '%Y-%m-%d %H:%M:%S'),
};

esbuild.build({
  entryPoints: [entryPoint],
  outfile: `dist/${p.name}-${build.format}.js`,
  bundle: true,
  minify: true,
  target: ['es6'],
  format: build.format,
  watch: serve,
  banner: {'js': `/**\n * Name: ${build.name} (${build.format.toUpperCase()}) v${build.version}\n * Author: ${build.author}\n * Date: ${build.date}\n */`},
})
.catch(() => process.exit(1));

if (serve) startWebServer();

function startWebServer () {

  let bs = browsersync.create();
  browsersync.init({
      server: '.',
      startPath: 'example',
      watch: true,
      notify: false,
      ignore: [
        './bin/*.*',
        './src/*.*', // esbuild is monitoring this folder.
        ],
  });

}

/**
 * Format a date
 * Example: `dateFormat (new Date (), "%Y-%m-%d %H:%M:%S")`
 * will return "2012-05-18 05:37:21".
 */
function dateFormat (date, format, utc = true) {
  utc = utc ? 'getUTC' : 'get';
  return format.replace (/%[YmdHMS]/g, i => {
    switch (i) {
      case '%Y': return date[utc + 'FullYear'] (); // no leading zeros required
      case '%m': i = 1 + date[utc + 'Month'] (); break;
      case '%d': i = date[utc + 'Date'] (); break;
      case '%H': i = date[utc + 'Hours'] (); break;
      case '%M': i = date[utc + 'Minutes'] (); break;
      case '%S': i = date[utc + 'Seconds'] (); break;
      default: return i.slice (1); // unknown code, remove %
    }
    // add leading zero if required
    return ('0' + i).slice (-2);
  });
}
