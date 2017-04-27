var path = require('path');
var webpackMerge = require('webpack-merge'); 
var commonConfig = require('./webpack.common.js');

module.exports = function (options) {
	return webpackMerge(commonConfig(),{
		output: {
		    library: "Contentstack",
		    libraryTarget: "umd",
		    path: path.join(__dirname, "../dist/web"),
		    filename: "contentstack.js"
		},
		resolve: {
			alias:{
		      runtime: path.resolve( __dirname,  '../src/runtime/web')
		    },
			modules: [
				'../src', 
				'../src/runtimes/web',
				'node_modules'
			]
		},
		node: {
		  fs: "empty",
		  child_process: 'empty'
		},
	});
}


