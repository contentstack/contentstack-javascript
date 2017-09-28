'use strict';

const path = require('path');
const webpackMerge = require('webpack-merge'); 

const commonConfig = require('./webpack.common.js');

module.exports = function (options) {
	return webpackMerge(commonConfig(),{
		output: {
		    library: "Contentstack",
		    libraryTarget:"commonjs2",
		    path: path.join(__dirname, "../dist/nativescript"),
		    filename: "contentstack.js"
		},
		resolve: {
			alias:{
		      runtime: path.resolve( __dirname,  '../src/runtime/nativescript')
		    },
			modules: [
				'../src', 
				'../src/runtimes/nativescript',
				'node_modules', 
			]
		}
	});
}


