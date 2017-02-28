/* global __dirname */

var path = require('path');

module.exports = {
  // define global variables
  // file loaders
  loaders: [
    {
      test: /(\.json)$/,
      loader: 'file-loader?name=js/[name].[ext]'
    },
    {
      test: /(\.jpg|\.jpeg|\.png|\.eot|\.ttf|\.svg|\.woff|\.woff2)$/,
      loader: 'file-loader?name=shinobi-fonts/[name]-[sha1:hash].[ext]'
    },
    {
      test: /\.scss$/,
      loader: 'style!css?outputStyle=expanded&' +
        'includePaths[]=' +
          (path.resolve(__dirname, './src/styles'))
    },
    {
      test: /\.html$/,
      exclude: /(node_modules|vendor)/,
      loader: 'html'
    },
    {
      test: /\.js$/,
      exclude: /(node_modules)/,
      loader: 'babel',
      query: {
        presets: ['es2015'],
        plugins: [
          'transform-class-properties',
          'transform-object-rest-spread'
        ]
      }
    }
  ],
  // resolve modules
  modulesDirectories: ['app', 'modules', 'node_modules', 'src'],
  // entry with vendors modules
  vendor: [
    // 'core-js',
  ]
};
