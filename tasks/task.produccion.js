/** Tareas Producción **/

/** Importación de plugins **/
var gulp        = require('gulp');
var Builder     = require('systemjs-builder');
var replace     = require('gulp-replace');
var cssnano     = require('gulp-cssnano');
var concat      = require('gulp-concat');

/** guuid **/
function guuid(){
  function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }
  return  (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

var filePath = {
  prod : {
    js:         'app-'+guuid()+'.js',
    css:        'app-'+guuid()+'.css',
    vendorCSS:  'vendor-'+guuid()+'.css',
    vendorJS:   'vendor-'+guuid()+'.js'
  }

}


/** Construcción vendor.js Producción **/
gulp.task('vendorJS-prod', function() {
    return gulp.src(['./jspm_packages/system.js','./jspm_packages/system-polyfills.js'])
    .pipe(concat(filePath.prod.vendorJS))
    .pipe(gulp.dest("./dist/vendor/"))
});

/** Construcción vendor.css Producción **/
gulp.task('vendorCSS-prod', function() {
    return gulp.src(['./jspm_packages/github/twbs/*/css/bootstrap.css','./jspm_packages/github/angular-ui/*/ui-grid.css','./jspm_packages/bower/*/css/font-awesome.css','./jspm_packages/bower/*/angular-ui-switch.css'])
    .pipe(concat(filePath.prod.vendorCSS))
    .pipe(cssnano({discardComments: {removeAll: true}}))
    .pipe(gulp.dest("./dist/vendor/"))
});

/** Construcción app.css Producción **/
gulp.task('appCSS-prod', function() {
    return gulp.src(['./app/styles/custom-navbar-bootstrap.css','./app/styles/cnmc-backoffice.css','./app/styles/cargador.css'])
    .pipe(concat(filePath.prod.css))
    .pipe(cssnano({discardComments: {removeAll: true}}))
    .pipe(gulp.dest("./dist/src/"))
});

/** Construcción app.js Producción **/
gulp.task('appJS-prod', function() {

  var builder = new Builder('','./config.js');

  builder.buildStatic('app','./dist/src/'+filePath.prod.js,{ minify: true, sourceMaps: false});

});

/** Construcción index.html Producción **/
gulp.task("html-prod", function() {

  gulp.src("app/index.html")
      .pipe(replace('System.import("app")', 'System.import("./src/'+filePath.prod.js+'")'))
      .pipe(replace('href="./vendor/vendor.css"', 'href="./vendor/'+filePath.prod.vendorCSS+'"'))
      .pipe(replace('href="./src/app.css"', 'href="./src/'+filePath.prod.css+'"'))
      .pipe(replace('src="./vendor/vendor.js"', 'src="./vendor/'+filePath.prod.vendorJS+'"'))
      .pipe(gulp.dest('dist'));
});
