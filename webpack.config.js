/* global __dirname */

var path = require('path');

module.exports = {
  // define global variables
  // file loaders
  rules: [
    {
      test: /(\.jpg|\.jpeg|\.png|\.eot|\.ttf|\.svg|\.woff|\.woff2)$/,
      loader: 'file-loader?name=shinobi-fonts/[name]-[sha1:hash].[ext]'
    },
    {
      test: /\.scss$/,
      use:[
         {
          loader: 'style-loader'
         },
         {
            loader: 'css-loader'
         },
         {
          loader: 'fast-sass-loader',
          options:{
            outputStyle: 'expanded',
            includePaths:[path.resolve(__dirname, './src/styles')]
          }
        }

      ]
    },
    {
      test: /\.html$/,
      exclude: /(node_modules)/,
      loader: 'html-loader'
    },
    {
      test: /\.js$/,
      exclude: /(node_modules)/,
      use:[
         {
          loader: 'babel-loader',
          options:{
            cacheDirectory: true,
            presets: ['env'],
            plugins: [
              'transform-runtime',
              'transform-class-properties',
              'transform-object-rest-spread'
            ]
          }
         }
       ]
    }
  ],
  // resolve modules
  modules: ['app', 'node_modules', 'src']
};
