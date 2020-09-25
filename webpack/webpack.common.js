'use strict';

const webpack = require('webpack');
const path = require('path');

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
                        query: {
                            search: '{{VERSION}}',
                            replace: Package.version
                        }
                    }
                ],
            }]
        },
        plugins: [
            new webpack.IgnorePlugin(/vertx/),
        ]
    };
}