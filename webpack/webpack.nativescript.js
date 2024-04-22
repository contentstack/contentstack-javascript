'use strict';

const path = require('path');
const webpackMerge = require('webpack-merge');
var nodeExternals = require('webpack-node-externals');

const commonConfig = require('./webpack.common.js');

module.exports = function(options) {
    return webpackMerge(commonConfig(), {
        output: {
            libraryTarget: "commonjs2",
            path: path.join(__dirname, "../dist/nativescript"),
            filename: "contentstack.js"
        },
        target: "node",
        externals: [nodeExternals()], 
        externalsPresets: {
            node: true
        },
        resolve: {
            alias: {
                runtime: path.resolve(__dirname, '../src/runtime/nativescript')
            },
            modules: [
                '../src',
                '../src/runtimes/native-script',
                'node_modules',
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
                            replace: 'react-native'
                        }
                    }
                ],
            }]
        }
    });
}