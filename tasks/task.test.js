/** Tareas Testing **/

/** Importación de plugins **/
var gulp        = require('gulp');
var Builder     = require('systemjs-builder');
var watch       = require('gulp-watch');
var replace     = require('gulp-replace');
var cssnano     = require('gulp-cssnano');
var concat      = require('gulp-concat');
var open 		    = require('gulp-open');
var angularProtractor = require('gulp-angular-protractor');



var filePath = {
  desa : {
    js:         'app.js',
    css:        'app.css',
    vendorCSS:  'vendor.css',
    vendorJS:   'vendor.js'
  }

}


/** Construcción vendor.js Test **/
gulp.task('vendorJS-test', function() {
    return gulp.src([
    	'./jspm_packages/system.js',
    	'./jspm_packages/system-polyfills.js',
    	'./jspm_packages/npm/*/lib/jasmine-core/jasmine.js',
    	'./jspm_packages/npm/*/lib/jasmine-core/jasmine-html.js',
    	'./app/test/boot.test.js'
    	])
    .pipe(concat(filePath.desa.vendorJS))
    .pipe(gulp.dest("./dist/vendor/"))
});

/** Construcción vendor.css Test **/
gulp.task('vendorCSS-test', function() {
    return gulp.src(['./jspm_packages/github/twbs/*/css/bootstrap.css','./jspm_packages/github/angular-ui/*/ui-grid.css','./jspm_packages/npm/*/lib/jasmine-core/jasmine.css'])
    .pipe(concat(filePath.desa.vendorCSS))
    .pipe(gulp.dest("./dist/vendor/"))
});

/** Construcción app.css Test **/
gulp.task('appCSS-test', function() {
    return gulp.src(['./app/styles/custom-navbar-bootstrap.css','./app/styles/cnmc-backoffice.css','./app/styles/cargador.css'])
    .pipe(concat(filePath.desa.css))
    .pipe(gulp.dest("./dist/src/"))
});

/** Construcción app.js Test **/
gulp.task('appJS-test', function() {

  var builder = new Builder('','./config.js');
  builder.buildStatic('app','./dist/src/'+filePath.desa.js,{ minify: false, sourceMaps: false});

});

/** Copiar el html de reporte de test **/
gulp.task('reporting-test-html', function() {
    return gulp.src("./app/test/**/*.html")
    .pipe(gulp.dest("./dist"))
});

/** Copiar todos los test **/
gulp.task('copy-test', function() {
    return gulp.src(["./app/controllers/**/*.js","./app/test/e2e.config.js"])
    .pipe(gulp.dest("./dist/src"))
});

var options = [
	{uri : 'http://127.0.0.1/ngCargador/dist/cargaExpress.spec.html',app : 'firefox'},
	{uri : 'http://127.0.0.1/ngCargador/dist/descargas.spec.html',app : 'firefox'},
	{uri : 'http://127.0.0.1/ngCargador/dist/listasCargas.spec.html',app : 'firefox'},
	{uri : 'http://127.0.0.1/ngCargador/dist/panelEntorno.spec.html',app : 'firefox'}
]

gulp.task('run-test-carga', function(){
  gulp.src(__filename)
  .pipe(open(options[0]));
});

gulp.task('run-test-listarCargas', function(){
  gulp.src(__filename)
  .pipe(open(options[1]));
});

gulp.task('run-test-descarga', function(){
  gulp.src(__filename)
  .pipe(open(options[2]));
});

gulp.task('run-test-panelEntorno', function(){
  gulp.src(__filename)
  .pipe(open(options[3]));
});

/** Watch **/
gulp.task('watch-test', function() {
  gulp.watch('./app/**/*.test.js', ['copy-test']);
});

 
gulp.task('protractor', function() {
    gulp
        .src(['./dist/src/panelEntorno.e2e.js'])
        .pipe(angularProtractor({
            'configFile': './dist/src/e2e.config.js',
            'debug': true,
            'autoStartStopServer': true
        }))
        .on('error', function(e) {
            console.log(e);
        })
});
