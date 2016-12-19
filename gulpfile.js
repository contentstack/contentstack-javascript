var path = require("path")

var gulp = require("gulp")
var minify = require("gulp-minify")
var gutil = require("gulp-util")
var replace = require('gulp-replace')
var clean = require('gulp-clean')

var webpack = require("webpack")

var pkg = require("./package.json")
var webpackConfig = require("./webpack.config.js")

// config
var config = {
    src: path.join(__dirname),
    configPath: path.join(__dirname, 'config.js'),
    sdkPath: path.join(__dirname, "examples", "browser", "scripts")
};

gulp.task("copy-to-sdk", function(callback) {
    // copy the generated files to sdk quick start
    gulp
        .src(path.join(webpackConfig.output.path, webpackConfig.output.filename))
        .pipe(gulp.dest(config.sdkPath))
    gulp
        .src(path.join(webpackConfig.output.path, webpackConfig.output.filename.replace('.js', '.min.js')))
        .pipe(gulp.dest(config.sdkPath))
})

gulp.task("watch", function(callback) {
    gulp.watch(config.src + '/**/*.js', ["build"])
})

gulp.task("webpack:clean", function(callback) {
    return gulp.src([
            path.join(webpackConfig.output.path, webpackConfig.output.filename),
            path.join(webpackConfig.output.path, webpackConfig.output.filename.replace('.js', '.min.js')),
            path.join(config.sdkPath, webpackConfig.output.filename),
            path.join(config.sdkPath, webpackConfig.output.filename.replace('.js', '.min.js'))
        ])
        .pipe(clean({force: true}))
        .pipe(gulp.dest(webpackConfig.output.path))
    callback()
})

// Production build
gulp.task("build", ["webpack:minbuild", "copy-to-sdk"]);

gulp.task("webpack:minbuild", ["webpack:build"], function(callback) {
    var _config = JSON.parse(JSON.stringify(webpackConfig));
    gulp.src(path.join(_config.output.path, _config.output.filename.replace('.js', '.min.js')))
        .pipe(replace("stag-api.contentstack.io", "api.contentstack.io"))
        .pipe(gulp.dest(_config.output.path));

    gulp
        .src(path.join(_config.output.path, _config.output.filename))
        .pipe(replace("stag-api.contentstack.io", "api.contentstack.io"))
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            },
            mangle: false
        }))
        .pipe(gulp.dest(_config.output.path));
});

gulp.task("webpack:build", ["webpack:clean"], function(callback) {
    // run webpack
    webpack(webpackConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task("default", ["watch"]);