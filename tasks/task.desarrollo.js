/** Tareas Desarrollo **/

/** Importación de plugins **/
var gulp        = require('gulp');
var Builder     = require('systemjs-builder');
var watch       = require('gulp-watch');
var replace     = require('gulp-replace');
var cssnano     = require('gulp-cssnano');
var concat      = require('gulp-concat');


var filePath = {
  desa : {
    js:         'app.js',
    css:        'app.css',
    vendorCSS:  'vendor.css',
    vendorJS:   'vendor.js'
  }

}

/** Construcción vendor.js Desarrollo **/
gulp.task('vendorJS-desa', function() {
    return gulp.src(['./jspm_packages/system.js','./jspm_packages/system-polyfills.js'])
    .pipe(concat(filePath.desa.vendorJS))
    .pipe(gulp.dest("./dist/vendor/"))
});


/** Construcción vendor.css Desarrollo **/
gulp.task('vendorCSS-desa', function() {
    return gulp.src([
      './jspm_packages/github/twbs/*/css/bootstrap.css',
      './jspm_packages/github/angular-ui/*/ui-grid.css',
      './jspm_packages/bower/*/css/font-awesome.css',
      './jspm_packages/bower/*/angular-ui-switch.css'
    ])
    .pipe(concat(filePath.desa.vendorCSS))
    .pipe(gulp.dest("./dist/vendor/"))
});

/** Construcción app.css Desarrollo **/
gulp.task('appCSS-desa', function() {
    return gulp.src(['./app/styles/custom-navbar-bootstrap.css','./app/styles/cnmc-backoffice.css','./app/styles/cargador.css'])
    .pipe(concat(filePath.desa.css))
    .pipe(gulp.dest("./dist/src/"))
});

/** Construcción app.js Desarrollo **/
gulp.task('appJS-desa', function() {

  var builder = new Builder('','./config.js');
  builder.buildStatic('app','./dist/src/'+filePath.desa.js,{ minify: false, sourceMaps: false});

});

/** Construcción index.html Desarrollo **/
gulp.task('html-desa', function () {

  gulp.src("app/index.html")
    .pipe(replace('System.import("app")', 'System.import("./src/'+filePath.desa.js+'")'))
    .pipe(gulp.dest('dist'));

});

/** Watch **/
gulp.task('watch', function() {
  gulp.watch('./app/index.html', ['html-desa']);
  gulp.watch('./app/**/*.ts', ['appJS-desa']);
  gulp.watch('./app/**/*.css', ['appCSS-desa']);
  gulp.watch(['./app/**/*.html','./app/**/*.png','./app/**/*.jpg'], ['copiar-archivos']);
});
