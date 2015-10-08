# Cargador de Ficheros

* Nombre: Cargador de ficheros
* Versión: 1.0
* Copyright: Comisión Nacional de los Mercados y la Competencia (CNMC)
* Última actualización: 07 Octubre 2015 


## 1. Introducción

El Cargador de Ficheros representa un ejemplo de aplicación cliente del API REST de la Sede Electrónica (SE) de la Comisión Nacional de los Mercados y la Competencia (CNMC).


## 2. Alcance

El API de la SE de la CNMC es un sistema de vertical conformado por un conjunto de servicios REST orientados a la carga y descarga de ficheros de la Sede.

El Cargador de Ficheros consume los servicios publicados por la Sede, quien les da un tratatamiento específico en función del procedimiento al que van dirigidos.


## 3. Entorno tecnológico

* HTML5
* CSS 3.0
* JQuery
* Flow.js
* Bootstrap, Bootstrap Toggle
* Bower


## 4. El API de la Sede

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


## 5. Instalación

Descargar el código del proyecto en Descargar ZIP. Descomprimir y colocar los artefactos en el directorio correspondiente de despliegues del servidor Web empleado.

### 5.1 Seguridad

El API de la SE implementa servicios de seguridad de autenticación para poder acceder a la misma y podrán ser de dos tipos:

* Certificado digital
* Autenticación OAuth1

Para solicitar los credenciales, remitirse en ambos casos a la página Web de la CNMC. 

 
## 6. Referencias

* [Página Web de la CNMC](http://www.cnmc.es/)
* [Documentación de las API's públicas](https://api.cnmc.gob.es/doc)
* [Escenarios básicos de carga de ficheros](https://api.cnmc.gob.es/doc/display/APIPUB/Casos+de+uso+de+carga+de+ficheros)

