'use strict';

const webpack = require('webpack');
const path = require('path');

const Package = require('./../package.json');
  
module.exports = function (options) {
  return {

    entry: {
      contentstack: "./src/core/contentstack",
    },

    resolve: {
      extensions: ['.js']
    },

    module: {
      rules: [
       {
          test: /\.js?$/,
          exclude: ['../node_modules'],
          use: [
            {
              loader:'babel-loader',
              options: {
                presets: ['es2015'],
              }
            },
            {
              loader:'string-replace-loader',
              query: {
                search: '{{VERSION}}',
                replace: Package.version
              }
            }
          ],
        }
      ]

    },

    plugins: [
       new webpack.IgnorePlugin(/vertx/),
     ]

  };
}


