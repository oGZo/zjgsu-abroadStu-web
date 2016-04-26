var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-minify-css');
var clean = require('gulp-clean');
var less = require('gulp-less');
var concat = require('gulp-concat');
var config = require('./conf/config.json');
var fs = require('fs');
var exec = require('child_process').exec;
//图片压缩
var smushit = require('gulp-smushit');
var htmlone = require('gulp-htmlone');
var path = require("path");
var rename = require("gulp-rename");
var plumber = require("gulp-plumber");
var base64 = require("gulp-base64");
var type = 'develop';
var sumTime = 0;
var objPath = 'build';
//清理build目录
gulp.task('clean', function (fn) {
    return gulp.src(objPath+'/*', {read: false})
        .pipe(clean());
});

//监听改变
gulp.task('watch', function () {
    gulp.watch(['resource/less/*.less','resource/less/*/*.less'], function(e){
        gulpCss();
    });
});

//合并精灵图片
gulp.task('icons', function () {
    exec('glue resource/images/sprites' +
        ' --img=resource/images' +
        ' --less=resource/less' +
        //' --retina' +
        ' --less-template=resource/images/sprites-tpl.jinja' +
        ' --namespace=yb' +
        ' --margin=6', function () {
        console.log('success.');
        ////压缩图片资源
        gulp.src(['resource/images/*.{png}','resource/images/build/*'])
            .pipe(smushit())
            .pipe(gulp.dest('app/images/'));
    });
});
gulp.task('build',function(){
    return gulp.src(['app/**'])
        .pipe(gulp.dest(objPath+'/'));
});

gulp.task('css', function(fn){
    gulpCss();
});

function gulpCss(){
    gulp.src(['resource/less/bootstrap.less','resource/less/global.less','resource/less/styles/*.less'])
        .pipe(plumber())
        .pipe(less())
        .pipe(base64({
            maxImageSize : 1024*1024,
            extensions: ['svg', 'png', /\.jpg#datauri$/i]
        }))
        .pipe(concat('app.css'))
        .pipe(gulp.dest('app/styles/'));

    gulp.src(['resource/less/module/*.less'])
        .pipe(plumber())
        .pipe(less())
        .pipe(base64({
            maxImageSize : 1024*1024,
            extensions: ['svg', 'png', /\.jpg#datauri$/i]
        }))
        .pipe(gulp.dest('app/styles/'));
    console.log('gulpCss');
}
gulp.task('watchCss', ['css'], function () {
  gulp.watch(['resource/less/*.less', 'resource/less/styles/*.less'], ['css']);
});

gulp.task('min',function(){
    gulp.src(objPath+'/styles/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest(objPath+'/styles'));

    gulp.src(objPath+'/scripts/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(objPath+'/scripts'));
    gulp.src(objPath+'/scripts/controllers/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(objPath+'/scripts/controllers'));
    gulp.src(objPath+'/scripts/directives/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(objPath+'/scripts/directives'));
    gulp.src(objPath+'/scripts/services/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(objPath+'/scripts/services'));
    gulp.src(objPath+'/lib/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(objPath+'/lib'));
    gulp.src(objPath+'/plugin/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(objPath+'/plugin'));
});

gulp.task('htmlone',function(){
    gulp.src(objPath+'/*.html')
        .pipe(htmlone())
        .pipe(gulp.dest(objPath));
});

//将公用插件移到插件区域
gulp.task('move-lib-js',function(){
    var srcDir = 'bower_components/';
    var jsPath = path.resolve(srcDir, '');
    var dirs = fs.readdirSync(jsPath);
    var filename,filePath;
    var libArr = ['angular','requirejs','jquery'];
    dirs.forEach(function (item) {
        filename = item;
        if(libArr.indexOf(item)==-1){
            filePath = srcDir + filename + '/';
            gulp.src(filePath + filename +  '.js')
                .pipe(gulp.dest('app/plugin'));
        }
    });
});

function build(setting){
    var htmlConfig = config[setting.type];
    htmlConfig.type = setting.type;
    htmlConfig.timestamp = new Date().getTime();
    if(setting.type == 'develop'){
        htmlConfig.Path = '/';
    }else{
        htmlConfig.Path = '';
    }
    fs.writeFileSync('./conf/version.json', JSON.stringify(config[setting.type]),'utf-8');
    var currentStr = 'var config =';
    currentStr += JSON.stringify(config[setting.type]);
    currentStr += ';';
    fs.writeFileSync('./app/scripts/current.js', currentStr,'utf-8');
    gulp.run('build');
}
gulp.task('develop', ['clean'],function(){
    build({
        type : 'develop'
    })
});

gulp.task('test', ['clean'] ,function(){
    build({
        type : 'test'
    })
});

gulp.task('online', ['clean'], function(){
    build({
        type : 'online'
    })
});

gulp.task('default', ['develop']);