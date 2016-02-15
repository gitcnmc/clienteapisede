
/** Importación de plugins **/
var gulp        = require('gulp');
var requireDir  = require('require-dir')('./tasks');
var runSequence = require('gulp-run-sequence');

gulp.task('copiar-archivos',['imagenes','views','templates','fonts','ui-grid','copy-systemjs']);

gulp.task('js/css-desarrollo',['vendorCSS-desa','vendorJS-desa','appCSS-desa','appJS-desa']);
gulp.task('js/css-produccion',['vendorCSS-prod','vendorJS-prod','appCSS-prod','appJS-prod']);
gulp.task('js/css-test',['vendorCSS-test','appCSS-test','vendorJS-test','appJS-test']);


/** Tarea producción - corre todas las tareas de producción **/
gulp.task('produccion',function(){
	runSequence('borrar-dist',['copiar-archivos','js/css-produccion','html-prod']);
});

/** Tarea desarrollo - corre todas las tareas de desarrollo **/
gulp.task('desarrollo', function(){
	runSequence('watch','borrar-dist',['copiar-archivos','js/css-desarrollo','html-desa']);
});

/** Tarea desarrollo - corre todas las tareas de desarrollo **/
gulp.task('test', function(){
	runSequence('watch-test','borrar-dist',['copiar-archivos','copy-test','js/css-test','reporting-test-html']);
});


// Tarea en pruebas. El despliegue se está haciendo en /home/dsantiagoadm
gulp.task('deploy', function(){
  runSequence('limpiar','comprimir','enviar','descomprimir',['limpiar-compresion-remota','limpiar-compresion-local'],'dodeploy');
  //Cuando acabe la última tarea, la desconexión ssh se cierra.
});
