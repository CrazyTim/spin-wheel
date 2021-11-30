import * as browsersync from 'browser-sync';

export default function startWebServer () {

  browsersync.create();

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
