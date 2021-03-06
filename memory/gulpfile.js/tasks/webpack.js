var path             = require('path');
var gulp             = require('gulp');
var gutil            = require('gulp-util');
var webpack          = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig    = require("../../webpack.config.js");

gulp.task("webpack-dev-server", function(callback) {

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(webpackConfig), { contentBase:path.join(__dirname, '../../www')}).listen(8080, "localhost", function(err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    });
});
