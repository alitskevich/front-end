/* global __dirname */
import 'core-js';
import webpackConfig from './webpack.config.js';
import karma from 'karma';

new karma.Server({
  basePath: '',
  browsers: [ 'PhantomJS' ],
  frameworks: [ 'jasmine' ],
  reporters: [ 'spec' ],
  files: [ 'src/**/*.test.js' ],
  preprocessors: {
    'src/**/*.test.js': [ 'webpack' ]
  },
  webpack: webpackConfig,
  webpackServer: {
  },
  client: {
    captureConsole: true
  },
  autoWatch: true,
  singleRun: false
}).start();
