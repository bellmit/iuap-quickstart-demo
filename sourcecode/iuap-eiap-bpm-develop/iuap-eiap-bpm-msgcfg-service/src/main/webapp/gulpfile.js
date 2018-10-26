var gulp = require('gulp');
var less = require('gulp-less');
var clean = require('gulp-clean');
var babel = require('gulp-babel');
var copy = require('gulp-copy');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var util = require('gulp-util');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var koa = require('koa');
var app = koa();
var cfg = require('./conf/config');
var zip = require('gulp-zip');
var fs = require('fs');

var DevServer = require("portal-fe-devServer");

var serverConfig = cfg.serverConfig;
var publishConfig = cfg.publishConfig;

function errHandle(err) {
    console.log(err);
    util.log(err.fileName + '文件编译出错，出错行数为' + err.lineNumber + '，具体错误信息为：' + err.message);
    this.end();
};
/*
// 编译 src 下所有的 html,js 文件到 dist 目录
gulp.task('copy:static', function () {
    gulp.src([
            'src/!**!/!**!/!*.html',
            'src/!**!/!**!/!*.js',
            'src/!**!/!**!/!*.json',
            'src/!**!/!**!/!*.png',
            'src/!**!/!**!/!*.jpg',
            'src/!**!/!**!/!*.gif',
            'src/!**!/!**!/!*.ico',
            'src/!**!/!**!/!*.css'])
        .pipe(rename(function (path) {
            path.dirname += '';
        }))
        .pipe(gulp.dest("./dist"));
});*/
/*
// 完整 copy font 目录下的资源到 dist
gulp.task('copy:font', function () {
    gulp.src([
            'src/fonts/!**!/!*.html',
            'src/fonts/!**!/!*.css',
            'src/fonts/!**!/!*.eot',
            'src/fonts/!**!/!*.svg',
            'src/fonts/!**!/!*.ttf',
            'src/fonts/!**!/!*.woff',
        ])
        .pipe(rename(function (path) {
            path.dirname += '';
        }))
        .pipe(gulp.dest('dist/fonts'));
    gulp.src([
            'src/font/!*.*'
        ])
        .pipe(rename(function (path) {
            path.dirname += '';
        }))
        .pipe(gulp.dest('dist/font'));
});*/

// 完整 copy trd 目录下的资源到 dist
gulp.task('copy:vendor', function () {
    gulp.src('./trd/**')
        .pipe(copy('./dist'));
});

// 完整 copy pages 目录下的资源到 dist
gulp.task('copy:pages', function () {
    gulp.src('./pages/**')
        .pipe(copy('./dist'));
});
// 完整 copy images 目录下的资源到 dist
gulp.task('copy:images', function () {
    gulp.src('./images/**')
        .pipe(copy('./dist'));
});
// 匹配所有 less文件进行 less 编译
gulp.task('less', function () {
    gulp.src('src/**/*.less')
        .pipe(less())
        .pipe(rename(function (path) {
            path.extname = ".css"
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('less:dist', function () {
    gulp.src(['src/**/*.less'])
        .pipe(less())
        .pipe(minifycss())
        .pipe(rename(function (path) {
            path.extname = ".css"
        }))
        .pipe(gulp.dest('dist'));
    gulp.src(['src/**/*.css'])
        .pipe(minifycss())
        .pipe(gulp.dest('dist'));
});


//
gulp.task('es2015', function () {
    console.log('编译 JS 代码，支持 ES6 语法编译')
    gulp.src(['src/**/*.es'])
        .pipe(babel({
            presets: ['es2015'],
            plugins: ['transform-es2015-modules-amd']
        }))
        .on('error', errHandle)
        .pipe(rename(function (path) {
            path.extname = ".js"
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('es2015:dist', function () {
    gulp.src(['src/**/*.es'])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015'],
            plugins: ['transform-es2015-modules-amd']
        }))
        .pipe(rename(function (path) {
            path.extname = ".js"
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .on('error', errHandle)
        .pipe(gulp.dest('dist'));
});

//打包为war
gulp.task("package", ['copy:vendor', 'copy:font', 'copy:static', 'es2015:dist', 'less:dist'], function () {
});
gulp.task("package2", function () {
    gulp.src(['dist/**', "!dist/**/*.map"]).pipe(zip('dist.war')).pipe(gulp.dest('./'));
    console.info('package ok!');
});
//安装到maven中
gulp.task("install", function () {

    if (!publishConfig) {
        console.console.error("can't find publishConfig in config.js");
    }
    var targetPath = fs.realpathSync('.');
    var installCommandStr = publishConfig.command + " install:install-file -Dfile=" + targetPath + "/dist.war   -DgroupId=" + publishConfig.groupId + " -DartifactId=" + publishConfig.artifactId + "  -Dversion=" + publishConfig.version + " -Dpackaging=war";
    console.log("=========");
    console.log("targetPath" + targetPath);
    console.log(installCommandStr);
    var process = require('child_process');
    var installWarProcess = process.exec(installCommandStr, function (err, stdout, stderr) {
        if (err) {
            console.log('install war error:' + stderr);
        }
    });
    installWarProcess.stdout.on('data', function (data) {
        console.info(data);
    });
    installWarProcess.on('exit', function (data) {
        console.info('install war success');
    })
})
//发布到maven仓库中
gulp.task("deploy", ["package"], function () {
    if (!publishConfig) {
        console.console.error("can't find publishConfig in config.js");
    }
    var process = require('child_process');
    var targetPath = fs.realpathSync('.');
    var publishCommandStr = publishConfig.command + " deploy:deploy-file  -Dfile=" + targetPath + "/dist.war   -DgroupId=" + publishConfig.groupId + " -DartifactId=" + publishConfig.artifactId + "  -Dversion=" + publishConfig.version + " -Dpackaging=war  -DrepositoryId=" + publishConfig.repositoryId + " -Durl=" + publishConfig.repositoryURL;
    console.info(publishCommandStr);
    var publishWarProcess = process.exec(publishCommandStr, function (err, stdout, stderr) {
        if (err) {
            console.log('publish war error:' + stderr);
        }
    });

    publishWarProcess.stdout.on('data', function (data) {
        console.info(data);
    });
    publishWarProcess.on('exit', function (data) {
        console.info('publish  war success');
    });

});

//监听文件改动，执行相应任务
gulp.task('watch', function () {
    console.log('监听文件改动，执行相应任务');
    gulp.watch('pages/**/*.less', ['less']);
    gulp.watch('trd/**/*.es', ['es2015']);
    gulp.watch(['pages/**/*.html', 'pages/**/*.js', 'pages/**/*.css'], ['copy:pages']);
});

//清空 dist 目录下的资源
gulp.task('clean', function () {
    console.log('清空 dist 目录下的资源')
    gulp.src('dist/*', {
        read: false
    })
        .pipe(clean({
            force: true
        }));
});

//
gulp.task('dev-server', function () {
    serverConfig.app = app;
    var mockServer = new DevServer(serverConfig);
    mockServer.start(serverConfig);
});

gulp.task('copy', ['copy:vendor','copy:pages', 'copy:images']);
gulp.task('before', ['copy', 'less', 'es2015']);
gulp.task('default', ['before', 'dev-server', 'watch']);
