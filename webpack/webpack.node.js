'use strict';
const path = require('path');
const webpackMerge = require('webpack-merge');

const commonConfig = require('./webpack.common.js');

module.exports = function(options) {
    return webpackMerge(commonConfig(), {
        output: {
            library: "Contentstack",
            libraryTarget: "commonjs2",
            path: path.join(__dirname, "../dist/node"),
            filename: "contentstack.js"
        },
        target: "node",
        resolve: {
            alias: {
                runtime: path.resolve(__dirname, '../src/runtime/node')
            },
            modules: [
                '../src',
                '../src/runtimes/node',
                'node_modules',
            ]
        },
        module: {
            rules: [{
                test: /\.js?$/,
                exclude: ['../node_modules'],
                use: [{
                    loader: 'string-replace-loader',
                    query: {
                        search: '{{PLATFORM}}',
                        replace: 'nodejs'
                    }
                }],
            }]
        }
    });
}