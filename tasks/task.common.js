/** Tareas comunes **/

/** Importación de plugins **/
var gulp        = require('gulp');
var del         = require('del');
var scp         = require('gulp-scp2');

/** Borrar contenido en /dist **/
gulp.task('borrar-dist', function(){
  del(['./dist/**/*.js',
        './dist/**/*.css',
        './dist/**/*.html',
        './dist/**/*.png',
        './dist/**/*.jpg',
        './dist/**/*.ico']);
});


/** Copiar las imágenes **/
gulp.task('imagenes', function() {
    return gulp.src("./app/img/**/*")
    .pipe(gulp.dest("./dist/img/"))
});

/** Copiar las vistas de Angular **/
gulp.task('views', function() {
    return gulp.src("./app/views/**/*")
    .pipe(gulp.dest("./dist/views/"))
});

/** Copiar los templates de Angular **/
gulp.task('templates', function() {
    return gulp.src("./app/templates/**/*")
    .pipe(gulp.dest("./dist/templates/"))
});

/** Copiar las fuentes de ui-grid de Angular **/
gulp.task('ui-grid', function() {
    return gulp.src(["./jspm_packages/github/angular-ui/bower-ui-grid@3.1.0/**/*.+(woff|ttf|svg|eot)"])
    .pipe(gulp.dest("./dist/vendor/"))
});

/** Copiar las fuentes **/
gulp.task('fonts', function() {
    return gulp.src(["./jspm_packages/bower/components-font-awesome@4.5.0/fonts/**/*"])
    .pipe(gulp.dest("./dist/fonts/"))
});

/** Copiar las fuentes de ui-grid de Angular **/
gulp.task('copy-systemjs', function() {
    return gulp.src([
        './jspm_packages/system.js',
        './jspm_packages/system-polyfills.js',
        './jspm_packages/system-polyfills.js.map',
        './jspm_packages/system-polyfills.src.js',
        './jspm_packages/system.js.map',
        './jspm_packages/system.src.js'])
    .pipe(gulp.dest("./dist/vendor/"))
});
