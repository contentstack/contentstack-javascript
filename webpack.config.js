var pckg = require('./package.json');
var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: path.join(__dirname, pckg.name+".js"),
    output: {
        path: path.join(__dirname, "dist"),
        filename: pckg.name+"-"+pckg.version+".js"
    }
};