/** Tareas de despliegue **/

/** Importación de plugins **/
var gulp        = require('gulp');
var GulpSSH     = require('gulp-ssh');
var fs         	= require('fs');
var tar         = require('gulp-tar');
var gzip        = require('gulp-gzip');
var argv        = require('yargs').argv;
var del         = require('del');


//Parametro de ejecución ej: > gulp deploy --destino madsedepre
var destino = argv.destino || 'madsededesa';

// Configuración de la conexión SSH
var config = {
  host: destino,
  port: 22,
  username: 'dsantiagoadm',
  privateKey: fs.readFileSync('D:/Users/dsantiago/Documents/keys/privateKey.ppk')
}

var gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config
})

//Tarea limpiar - limpia toda la carpeta en la que vallas a desplegar.
gulp.task('limpiar', function () {
  return gulpSSH
    .exec(['rm -rf /opt/wildfly/standalone/deployments/cargador.war/*'], {filePath: 'deploy.log'})
    .pipe(gulp.dest('logs'))
});

//Tarea comprimir - comprime en local la carpeta dist.
gulp.task('comprimir', () => {
  return gulp.src('./dist/**/*')
    .pipe(tar('dist.tar',{mode:0755})) //mode:0755 para comprimir archivos y directorios.
    .pipe(gzip())
    .pipe(gulp.dest('.'));
});

//Tarea enviar - transfiere el archivo comprimido al destino elegido por sftp.
gulp.task('enviar', function () {
  return gulp.src('./dist.tar.gz')
    .pipe(gulpSSH.sftp('write', '/opt/wildfly/standalone/deployments/cargador.war/dist.tar.gz'));
});

//Tarea descomprimir - descomprime el archivo remoto
gulp.task('descomprimir', function () {
  return gulpSSH
    .exec(['tar -zxvf /opt/wildfly/standalone/deployments/cargador.war/dist.tar.gz -C /opt/wildfly/standalone/deployments/cargador.war'], {filePath: 'deploy.log'})
    .pipe(gulp.dest('logs'))
});

//Tarea limpiar-compresion - limpia la compresion en remoto
gulp.task('limpiar-compresion-remota', function () {
  return gulpSSH
    .exec(['rm -rf /opt/wildfly/standalone/deployments/cargador.war/dist.tar.gz'], {filePath: 'deploy.log'})
    .pipe(gulp.dest('logs'))
});

//Tarea limpiar-compresion - limpia la compresion en remoto
gulp.task('limpiar-compresion-local', function () {
  del(['./dist.tar.gz']);
});

//Tarea dodeploy - renombrar el archivo cargador.war.deployed
gulp.task('dodeploy', function () {
  return gulpSSH
    .exec(['mv /opt/wildfly/standalone/deployments/cargador.war.deployed /opt/wildfly/standalone/deployments/cargador.war.dodeploy'], {filePath: 'deploy.log'})
    .pipe(gulp.dest('logs'))
});
