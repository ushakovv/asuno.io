/**
 * Created by vasa on 26.03.14.
 */

/* eslint-env node */
/* eslint block-scoped-var:0 */

'use strict';

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  plumber = require('gulp-plumber'),
  prefix = require('gulp-autoprefixer'),
  tar = require('gulp-tar'),
  gzip = require('gulp-gzip'),
  cache = require('gulp-cached'),
  cssmin = require('gulp-minify-css'),
  uglify = require('gulp-uglify'),
  useref = require('gulp-useref'),
  imagemin = require('gulp-imagemin'),
  spritesmith = require('gulp.spritesmith'),
  eslint = require('gulp-eslint'),
  ngAnnotate = require('gulp-ng-annotate'),
  gulpif = require('gulp-if'),
  rev = require('gulp-rev'),
  revReplace = require('gulp-rev-replace'),
  lazypipe = require('lazypipe'),
  babel = require('gulp-babel'),
  sourcemaps = require('gulp-sourcemaps'),
  scp = require('gulp-scp2'),
  publicKeyValue = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC07neaRn+EVcQK0vdM2YobkNqYoUcSJp/oYcV64ilr9d11Y7ndRF4Pqv3JxcQ10v9XqwjznlaIyuob5cc+nvUfsy21u2yGCgtdl1Wy9kM3+pz0yNwMYzYZQmDLt8lmnHXbGnVDGjx40kYX/1vOIuP14kTNz/I85xqOOI3J51OTVnu1PHEkQOTXgwhLTc3mF5m+2M43yndUxu5HtXwqkKmn8FWSSS8eVOmCQCD4N13aPZ6Y439LfBkAE6ur0K2C3UmiTEq9UvfZj/ZLAk4/zX0hYKIFA6a+KRr0qSwYFK0IS+pGMmhNL7Ul6M63wKUGOYUJx142XV3BdbvK85sMfED07ezb173FD/vS10RetgSxCbWbRHmylV4iop0vGfr7DubuQT9sLUZwp3pL2rXRoAaJsInsGAPbKbMyn9zw6jtKwZFWlLuBLxAvwKbnGhEVJSfHNI0vpHgFX95pwbVN9qBROhpaG/jJHREI95QzjRa8tCr7d0ClNrgHKvMleciVyEbQCKflb03q9CO5HvuLwU88OR3Ye0wqW0IN1Uw0nMZ0FxtM/2QSPcEWDUKD72FD0IsUKCS3FNwJXMFUpl5MU1ERANwHrGTgD2c3lpF9zKG4BCaYBZTG0ImeMZdMwD9viP0WA6K1l2eH76gFoIqquKLH5+WjClRp8aKAlkCdSxcsyw== rusustyugov@gmail.com';

var app = 'interface/',
  dist = 'dist/',
  statik = dist + '/assets/';

gulp.task('copy templates', function () {
  gulp.src(app + 'templates/**/*.html')
    .pipe(cache('tmpl'))
    .pipe(gulp.dest(statik + '/templates'));
});

gulp.task('copy bootstrap fonts', function () {
  gulp.src(['bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*', 'bower_components/font-awesome/fonts/*'])
    .pipe(cache('bf'))
    .pipe(gulp.dest(statik + '/fonts'));
});

gulp.task('copy images', function () {
  gulp.src(app + 'img/**/*')
    .pipe(cache('cim'))
    .pipe(gulp.dest(statik + '/img'));
});

gulp.task('copy vendor', function () {
  gulp.src(app + 'vendor/**/*')
    .pipe(cache('vendor'))
    .pipe(gulp.dest(statik + '/vendor'));
});

gulp.task('copy', ['copy templates', 'copy bootstrap fonts', 'copy images', 'copy vendor']);

gulp.task('sass', function () {
  return gulp.src(app + 'scss/dashboard.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({precision : 10}))
    .pipe(prefix({browsers : ["last 4 versions", "> 1%", "ie > 6", "Firefox > 3"], cascade : false}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.tmp/css'));
});

var simpleAnnotate = lazypipe()
  .pipe(sourcemaps.init)
  .pipe(babel, {loose: true, compact: true})
  .pipe(sourcemaps.write);

var fullAnnotateDev = lazypipe()
  .pipe(sourcemaps.init)
  .pipe(babel, {loose: true, compact: false})
  .pipe(sourcemaps.write);

var fullAnnotate = lazypipe()
  .pipe(babel, {loose: true, compact: true})
  .pipe(ngAnnotate, {remove : true, add : true, single_quotes : true})
  .pipe(uglify);

gulp.task('useref', ['sass'], function () {
  var assets = useref.assets();

  return gulp.src(app + '/index.html')
    .pipe(assets)
    .pipe(gulpif('**/index.html.app.js', simpleAnnotate()))
    .pipe(rev())
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(revReplace())
    .pipe(gulp.dest(dist));
});

gulp.task('useref-full', ['sass'], function () {
  var assets = useref.assets();

  return gulp.src(app + '/index.html')
    .pipe(assets)
    .pipe(gulpif('**/index.html.app.js', fullAnnotate()))
    .pipe(gulpif('**!/index.html.scripts.js', uglify()))
    .pipe(gulpif('**/index.html.style.css', cssmin({keepSpecialComments : 0, roundingPrecision : -1})))
    .pipe(rev())
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(revReplace())
    .pipe(gulp.dest(dist));
});

gulp.task('useref-full-dev', ['sass'], function () {
  var assets = useref.assets();

  return gulp.src(app + '/index.html')
    .pipe(assets)
    .pipe(gulpif('**/index.html.app.js', fullAnnotateDev()))
    .pipe(gulpif('**/index.html.style.css', cssmin({keepSpecialComments : 0, roundingPrecision : -1})))
    .pipe(rev())
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(revReplace())
    .pipe(gulp.dest(dist));
});

gulp.task('eslint', function () {
  return gulp.src(app + 'app/**/*.js*')
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('imagemin', function () {
  gulp.src(app + 'img/**/*.{png,jpg,gif}')
    .pipe(imagemin({
      optimizationLevel : 7,
      progressive       : true,
      interlaced        : true
    }))
    .pipe(gulp.dest(app + 'img/'));
});

gulp.task('sprites', function () {
  gulp.src(app + 'img/menu/*.png')
    .pipe(spritesmith({
      imgName : 'sprite.png',
      cssName : '_menu.scss'
    }))
    .pipe(gulp.dest(app + 'img/menu'));
});

gulp.task('tarball', function () {
  return gulp.src('dist/**/*')
    .pipe(tar('dist.tar'))
    .pipe(gzip())
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['copy', 'sass', 'eslint', 'useref-full']);
gulp.task('dev', ['copy', 'sass', 'eslint', 'useref-full-dev']);


gulp.task('simple', ['copy', 'sass', 'eslint', 'useref']);
gulp.task('simple-js', ['eslint', 'useref']);

gulp.task('simple-js', ['eslint', 'useref']);

gulp.task('watch', ['copy', 'sass', 'react', 'jshint', 'eslint', 'useref'], function () {
  gulp.watch(app + '**/*', ['default']);
});

gulp.task('watch-simple', ['simple'], function () {
  gulp.watch('./interface/index.html', ['simple']);
  gulp.watch(app + 'img/**/*', ['copy']);
  gulp.watch(app + 'templates/**/*', ['copy']);
  gulp.watch(app + 'app/**/*', ['useref']);
  gulp.watch(app + 'scss/**/*', ['useref']);
});


gulp.task('scp', function() {
  return gulp.src('dist.tar.gz')
  .pipe(scp({
    host: '95.215.110.99',
    username: 'asuno',
    dest: '/home/asuno/src/',
    publicKey: publicKeyValue,
    agent: process.env['SSH_AUTH_SOCK'],
    agentForward: true,
    watch: function(client) {
      client.on('write', function(o) {
        console.log('write %s', o.destination);
      });
    }
  }))
  .on('error', function(err) {
    console.log(err);
  });
});
