var webpack = require('webpack');
var path = require('path');

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
            use: [{
              loader:'babel-loader',
              options: {
                presets: ['es2015'],
              }
            }],
        }
      ]
    },

    plugins: [
       new webpack.IgnorePlugin(/vertx/),
     ]

  };
}


