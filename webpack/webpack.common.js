'use strict';

const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const Package = require('./../package.json');

const PROD = process.env.NODE_ENV === 'production'

module.exports = function(options) {
    return {
        mode: PROD ? 'production' : 'development',
        entry: {
            contentstack: "./src/core/contentstack",
        },
        resolve: {
            extensions: ['.js']
        },
        module: {
            rules: [{
                test: /\.js?$/,
                exclude: '/node_modules/',
                use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015'],
                        }
                    },
                    {
                        loader: 'string-replace-loader',
                        options: {
                            search: '{{VERSION}}',
                            replace: Package.version
                        }
                    }
                ],
            }]
        },
        plugins: [
            new webpack.WatchIgnorePlugin({
                paths: [/vertx/]
              }),
            new CleanWebpackPlugin({
                protectWebpackAssets: false,
                cleanAfterEveryBuildPatterns: ['*.LICENSE.txt']
            })
        ]
    };
}