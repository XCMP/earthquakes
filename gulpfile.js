
// USED MODULES
var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'),
    handlebars = require('gulp-handlebars'),
    livereload = require('gulp-livereload'),
    shell      = require('gulp-shell'),
    del        = require('del');

// CONSTANTS
var paths = {
  scripts: {
    libs: [
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/underscore/underscore.js',
      'node_modules/backbone/backbone.js',
      'node_modules/handlebars/dist/handlebars.runtime.js'
    ],
    app: [
      'src/app/earthquakes-app.js',
      'src/app/earthquakes.js',
      'src/app/earthquakes-actions-view.js',
      'src/app/earthquakes-view.js',
      'src/app/earthquakes-map-view.js',
      'src/app/earthquakes-utils.js'
    ],
    css: [
      'src/css/earthquakes.css'
    ]
  },
  styles: 'src/css/*.css',
  templates: 'src/hbs/*.hbs'
};

// TASKS
gulp.task('clean', function() {
  del(['dist']);
});

gulp.task('base', function() {
  return gulp.src('index.html')
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
});

gulp.task('scripts-libs', function() {
  return gulp.src(paths.scripts.libs)
    .pipe(uglify())
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-app', function() {
  return gulp.src(paths.scripts.app)
    .pipe(uglify())
    .pipe(concat('earthquakes-app.min.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(livereload());
});

gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe(concat('earthquakes-app.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload());
});

gulp.task('templates', function() {
    return gulp.src('')
    .pipe(shell([
      'rm -rf dist/js/templates',
      'mkdir -p dist/js/templates',
      'handlebars src/hbs/*.hbs -f dist/js/templates/hbs-templates.js'
    ]))
    .pipe(livereload());
  });

gulp.task('build', ['clean', 'base', 'scripts-libs', 'scripts-app', 'styles', 'templates'], function() {
  console.log('Build done.')
});

gulp.task('watch', ['build'], function() {
  livereload.listen();
  gulp.watch(paths.scripts.lib, ['scripts-libs']);
  gulp.watch(paths.scripts.app, ['scripts-app']);
  gulp.watch(['index.html'], ['base']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.templates, ['templates']);
});

// DEFAULT TASK
gulp.task('default', ['watch'], function(){
  console.log('Watching...');
});

