import * as browsersync from 'browser-sync';

export default function startWebServer (startPath) {

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
