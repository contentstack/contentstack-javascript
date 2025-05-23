'use strict';

const path = require('path');
const { merge }  = require('webpack-merge');
const TerserPlugin = require("terser-webpack-plugin");
var nodeExternals = require('webpack-node-externals');

const commonConfig = require('./webpack.common.js');

module.exports = function(options) {
    return merge(commonConfig(), {
        output: {
            libraryTarget: "commonjs2",
            path: path.join(__dirname, "../dist/react-native"),
            filename: "contentstack.js"
        },
        resolve: {
            alias: {
                runtime: path.resolve(__dirname, '../src/runtime/react-native')
            },
            modules: [
                '../src',
                '../src/runtimes/react-native',
                'node_modules',
            ]
        },
        target: 'node', 
        externals: [nodeExternals()],
        externalsPresets: {
            node: true
        },
        // optimization: {
        //     minimize: true,
        //     minimizer: [new TerserPlugin({
        //         terserOptions: { output: { ascii_only: true } }
        //     })],
        // },
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
        },
        optimization: {
            minimize: false, // Prevents code compression/minification
        },
    });
}