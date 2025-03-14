'use strict';

const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const Package = require('./../package.json');

module.exports = function(options) {
    return {
        mode: 'production',
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
                            presets: ['@babel/preset-env'],
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
        ],
        optimization: {
            minimize: false, // Prevents code compression/minification
        },
    };
}