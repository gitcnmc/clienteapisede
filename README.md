# Cargador de Ficheros

* Nombre: Cargador de ficheros
* Versión: 2.0
* Copyright: Comisión Nacional de los Mercados y la Competencia (CNMC)
* Última actualización: 15 Febrero 2016

<br/>

## 1. Introducción

El Cargador de Ficheros representa un ejemplo de aplicación cliente del API REST de la Sede Electrónica (SE) de la Comisión Nacional de los Mercados y la Competencia (CNMC).

<br/>

## 2. Alcance

El API de la SE de la CNMC es un sistema de vertical conformado por un conjunto de servicios REST orientados a la carga y descarga de ficheros de la Sede.

El Cargador de Ficheros consume los servicios publicados por la Sede, quien les da un tratatamiento específico en función del procedimiento al que van dirigidos.

<br/>

## 3. Entorno tecnológico

* HTML5
* CSS 3.0
* AngularJS
* Typescript
* Bootstrap
* SystemJS
* JSPM
* ui-grid
* GULP

<br/>

## 4. Instalación de la aplicación

#### NodeJS

Windows:
Para instalar NodeJS solo hace falta descargarlo desde [aquí](https://nodejs.org/en/). Una vez descargado, ejecutas el instalador y ¡ya lo tienes! A partir de ahora, para ejecutar "Node" tienes que irte a la línea de comandos de Windows e introducir el comando "node".

Linux:
`sudo apt-get install -y nodejs`

#### Iniciar npm

`npm init -y`
Crear un archivo configuración de nuestro proyecto. Añadimos -y para hacer una creación con los valores por defecto.

#### Manejador de paquetes JSPM

Vamos a utilizar la herramienta [JSPM](http://jspm.io/) que se va a encargar de hacer transparente al desarrollador toda la gestión de librerías necesarias para la implementación del proyecto gracias a SystemJS y nos va a permitir configurar el proyecto para trabajar con TypeScript.
Para instalar la herramienta ejecutar en el terminal:

`npm install -g jspm`

Añadimos -g para instalar la herramienta de forma global en el equipo.

Tendremos que iniciar la herramienta jspm con la siguiente sentencia:

`jspm init`

Si no existe el archivo config.js el terminal nos hara una serie de preguntas que deberemos contestar:

* Would you like jspm to prefix the jspm package.json properties under jspm? [yes] → La primera indica si queremos añadir el prefijo jspm en las dependencias que se almacenan en el fichero package.json, que dejamos por defecto porque si nos interesa.
* Enter server baseURL (public folder path) [./]: → La siguiente nos permite establecer la base url del servidor, también la dejamos por defecto.
* Enter jspm packages folder [./jspm_packages]: → La siguiente nos permite cambiar el nombre de la carpeta en la que se almacenan las dependendencias, es buena idea seguir el estándar y dejarlo por defecto.
* Enter config file path [./config.js]: → En la siguiente nos permite decidir donde queremos crear el fichero config.js, lo dejamos por defecto en la raíz del proyecto.
* Configuration file config.js doesn’t exist, create it? [yes]: → nos permite crear el fichero config.js, por defecto, si.
* Enter client baseURL (public folder URL) [/]: → nos permite establecer la url base del cliente, también la dejamos por defecto.
* Do you wish to use an ES6 transpiler? [yes]: → nos pregunta si queremos transpilar el código, lo dejamos por defecto porque definitivamente vamos a necesitar transpilar el código.
* Which ES6 transpiler would you like to use, Babel, TypeScript or Traceur? [babel]:TypeScript → Nos pregunta con que tipo de transpilador, como vamos a trabajar con TypeScript, seleccionamos TypeScript.


Falta instalar todos los paquetes que utiliza la aplicación. A continuación se muestra la lista de dependencias de la aplicación con su correspondiente sentencia de instalación:

* [AngularJS](https://angularjs.org/) · `jspm install angular` (si conservas el archivo config.js del proyecto, al ejecutar esta sentencia también se instalará angular-route, angular-resource y angular-mock, por lo que no hara falta instalar estos paquetes)
* [Angular-Route](https://docs.angularjs.org/api/ngRoute) · `jspm install angular-route`
* [Angular-Resource](https://docs.angularjs.org/api/ngResource) · `jspm install angular-resource`
* [Angular-Mock](https://docs.angularjs.org/api/ngMock) · `jspm install angular-mock`
* [ui-grid](http://ui-grid.info/) · `jspm install angular-ui-grid`
* [Oauth Signature](https://github.com/bettiolo/oauth-signature-js) · `jspm install npm:oauth-signature`
* [BootStrap](http://getbootstrap.com/) · `jspm install bootstrap`
* [Angular UI Bootstrap](https://angular-ui.github.io/bootstrap/) · En este framework necesitaremos instalar antes [Bower command-line](https://www.npmjs.com/package/jspm-bower-endpoint) adaptado a JSPM. `jspm install bower:angular-bootstrap`
* [Angular i18n](https://docs.angularjs.org/guide/i18n) · `jspm install bower:angular-i18n`
* [Angular UI Switch](https://github.com/xpepermint/angular-ui-switch) · `jspm install bower:angular-ui-switch2`


Con todo esto instalado ya tendriamos todos los paquetes que utiliza la aplicación instalados.

#### GULP

Vamos a utilizar la herramienta [GULP](http://gulpjs.com/) que se va a encargar de correr todas las tareas de construcción de nuestra aplicación. Para instalar gulp ejecutar la siguiente sentencia:

`npm install gulp`

Podemos ver mas información de como empezar a utilizar la herramienta gulp [aquí](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)

Ahora solo nos queda instalar todos los plugins que se utiliza en la construcción de la aplicación. A continuación se muestra la lista de plugins con su correspondiente sentencia de instalación:

* [del](https://www.npmjs.com/package/del) · `npm install del`
* [systemjs-builder](https://github.com/systemjs/builder) · `npm install systemjs-builder`
* [gulp-cssnano](https://www.npmjs.com/package/gulp-cssnano) · `npm install gulp-cssnano`
* [gulp-replace](https://www.npmjs.com/package/gulp-replace) · `npm install gulp-replace`
* [gulp-watch](https://www.npmjs.com/package/gulp-watch) · `npm install gulp-watch`
* [gulp-concat](https://www.npmjs.com/package/gulp-concat) · `npm install gulp-concat`
* [gulp-run-sequence](https://www.npmjs.com/package/run-sequence) · `npm install run-sequence`
* [require-dir](https://www.npmjs.com/package/require-dir) · `npm install require-dir`
* [gulp-ssh](https://www.npmjs.com/package/gulp-ssh) · `npm install gulp-ssh`
* [gulp-tar](https://www.npmjs.com/package/gulp-tar) · `npm install gulp-tar`
* [gulp-gzip](https://www.npmjs.com/package/gulp-gzip) · `npm install gulp-gzip`
* [yargs](https://www.npmjs.com/package/yargs) · `npm install yargs`



En el archivo gulpfile.js hay 2 tareas "principales" creadas. Una tarea para construir la aplicación en modo desarrollo y otra en modo producción:

`gulp desarrollo`

`gulp producción`


## 5. El API de la Sede

A continuación se indican los diferentes tipos de servicios del API de la SE:

### Tipos de servicio

#### a. Test

[Servicios](https://api.cnmc.gob.es/doc/display/APIPUB/Test) de test para comprobar la disponibilidad del servicio.

#### b. Catálogo

[Servicios](https://api.cnmc.gob.es/doc/display/APIPUB/Catalogo) para obtener el conjunto de procedimientos existentes y que determinan el tratamiento de los ficheros cargados.

Pueden ser de dos tipos:

* Procedimientos
* Tipos de ficheros

#### c. Carga

[Servicios](https://api.cnmc.gob.es/doc/display/APIPUB/Carga) para la carga de ficheros.

A continuación se muestran algunos escenarios básicos para la carga de ficheros:

Carga de fichero completo (carga express):

	1. Cargar fichero completo

Carga de multiples ficheros (carga elaborada):

	1. Iniciar carga
	2. Subir fichero completo (repetitivo)
	3. Confirmar carga

Carga de multiples ficheros por partes (carga elaborada):

	1. Iniciar carga
	2. Subir chunk de fichero (repetitivo)
	3. Confirmar carga

Además existen otros servicios para el listado y cancelación de ficheros y cargas.


#### d. Descarga

[Servicios](https://api.cnmc.gob.es/doc/display/APIPUB/Descarga) para la consulta, descarga de ficheros y listado de pendientes.

<br/>


### 6. Seguridad

El API de la SE implementa servicios de seguridad de autenticación para poder acceder a la misma y podrán ser de dos tipos:

* Certificado digital
* Autenticación OAuth1

Para solicitar los credenciales, remitirse en ambos casos a la página Web de la CNMC.

<br/>

## 7. Referencias

* [Página Web de la CNMC](http://www.cnmc.es/)
* [Documentación de las API's públicas](https://api.cnmc.gob.es/doc)
* [Escenarios básicos de carga de ficheros](https://api.cnmc.gob.es/doc/display/APIPUB/Casos+de+uso+de+carga+de+ficheros)

<br/>
