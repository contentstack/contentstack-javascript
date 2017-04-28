var path = require('path');
var webpackMerge = require('webpack-merge'); 
var commonConfig = require('./webpack.common.js');

module.exports = function (options) {
	return webpackMerge(commonConfig(),{
		output: {
		    library: "Contentstack",
		    libraryTarget:"commonjs2",
		    path: path.join(__dirname, "../dist/react-native"),
		    filename: "contentstack.js"
		},
		target: "node",
		resolve: {
			alias:{
		      runtime: path.resolve( __dirname,  '../src/runtime/react-native')
		    },
			modules: [
				'../src', 
				'../src/runtimes/react-native',
				'node_modules', 
			]
		}
	});
}


