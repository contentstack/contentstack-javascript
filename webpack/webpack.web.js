'use strict';

const path = require('path');
const webpackMerge = require('webpack-merge');

const commonConfig = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = function(options) {
    return webpackMerge(commonConfig(), {
        output: {
            library: "Contentstack",
            libraryTarget: "umd",
            path: path.join(__dirname, "../dist/web"),
            filename: "contentstack.js"
        },
        resolve: {
            alias: {
                runtime: path.resolve(__dirname, '../src/runtime/web')
            },
            modules: [
                '../src',
                '../src/runtimes/web',
                'node_modules'
            ]
        },
        module: {
            rules: [{
                test: /\.js?$/,
                exclude: '/node_modules/',
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [['@babel/preset-env', {
                                modules: "commonjs"
                            }]],
                        }
                    },
                    {
                        loader: 'string-replace-loader',
                        options: {
                            search: '{{PLATFORM}}',
                            replace: 'web'
                        }
                    }
                ],
            }]
        },
        node: {
            global: false
          },
          plugins: [
            new webpack.ProvidePlugin({
                global: require.resolve('./../global.js')
              })
        ],
        optimization: {
            minimize: true,
        },
    });
}