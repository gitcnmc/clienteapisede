
/***************************************************************************************************
                                IMPORTACIÓN DE PAQUETES DE LA APP
/***************************************************************************************************/

declare var angular: any;
import 'angular';
import 'angular-resource';
import 'angular-route';
import 'angular-bootstrap';
import 'angular-mocks';
import 'angular-ui-grid';
import 'angular-i18n/angular-locale_es';
import 'angular-ui-switch2';

var aModulos = ['ngResource', 'ngRoute', 'ui.bootstrap', 'ui.grid','ui.grid.autoResize','ui.grid.expandable','uiSwitch'];
//var aModulos = ['ngResource','ngRoute','ngTable'];

// solo fase test
if (window.hasOwnProperty('test')) {
  aModulos.push('ngMock')
}

/**
 * Crea el module cargador.
 * @param {string} nombre del module.
 * @param {array} lista de módulos que depende el modulo cargador.
 */
export var app = angular.module('cargador',aModulos);



/***************************************************************************************************
                                IMPORTACIÓN DE FACTORIAS
/***************************************************************************************************/

import {AlertaFactory} from './factory/alerts';
import {ConsumidorRestFactory} from './factory/consumidorRest';
import {PeticionesPendientesFactory} from './factory/controlPeticiones';
import {CredencialesFactory} from './factory/credenciales';
import {EntornoFactory} from './factory/entornoAutorizacion';
import {OauthFactory} from './factory/oauth';
import {TablaFactory} from './factory/tablas.ts';
import {CatalogoFactory} from './factory/catalogo';


/*** Factoria que gestiona las alertas ***/
app.factory('AlertaResource',[()=> {
  return new AlertaFactory();
}]);

app.factory('tabla',['uiGridConstants',(uiGridConstants)=> {
  return new TablaFactory(uiGridConstants);
}]);

/*** Factoria que controla las peticiones HTTP ***/
app.factory('PendingRequestsResource',()=> {
  return new PeticionesPendientesFactory();
});

/*** Factoria que gestiona las credenciales oauth ***/
app.factory('CredencialesResource',['$timeout',($timeout) => {
  return new CredencialesFactory($timeout);
}]);

/***  Factoria que gestiona el entorno ***/
app.factory('EntornoResource',[() => {
  return new EntornoFactory();
}]);

/***  Factoria que consume servicios REST ***/
app.factory('ConsumidorResource',['$resource','$http','$timeout','$q','PendingRequestsResource','CredencialesResource','EntornoResource',($resource,$http,$timeout,$q,PendingRequestsResource,CredencialesResource,EntornoResource) => {
  return new ConsumidorRestFactory($resource,$http,$timeout,$q,PendingRequestsResource,CredencialesResource,EntornoResource);
}]);

/*** Factoria que ofrece la firma de la url con oauth ***/
app.factory('OauthResource',['$q', 'ConsumidorResource', 'CredencialesResource', 'EntornoResource',($q,ConsumidorResource,CredencialesResource,EntornoResource)=> {
  return new OauthFactory($q,ConsumidorResource,CredencialesResource,EntornoResource);
}]);

/***  Factoria que gestiona el entorno ***/
app.factory('catalogo',['ConsumidorResource','$q',(ConsumidorResource,$q) => {
  return new CatalogoFactory(ConsumidorResource,$q);
}]);



/***************************************************************************************************
                                IMPORTACIÓN DE CONTROLLERS
/***************************************************************************************************/


import {CargaExpressControl} from './controllers/cargaExpress';
import {DescargasControl} from './controllers/descargas';
import {InfoController} from './controllers/info';
import {ListasCargasControl} from './controllers/listasCargas';
import {PanelEntornoControl} from './controllers/panelEntorno';
import {ModalEstandarControl,ModalEstadoCargaControl,ModalOpcionesCargaControl} from './controllers/modales';

app.controller('cargaExpressControl',CargaExpressControl);
app.controller('descargasControl',DescargasControl);
app.controller('listasCargasControl',ListasCargasControl);
app.controller('infoController',InfoController);
app.controller('panelEntornoControl',PanelEntornoControl);
app.controller('principalControl', ['$scope', 'EntornoResource', ($scope, EntornoResource) =>{
  $scope.mostrarSideBar = true;
  $scope.entorno = EntornoResource;
}]);
app.controller('modalEstandarControl',ModalEstandarControl);
app.controller('modalEstadoCargaControl',ModalEstadoCargaControl);
app.controller('modalOpcionesCargaControl',ModalOpcionesCargaControl);



/***************************************************************************************************
                                IMPORTACIÓN DE LA CONFIGURACIÓN DE LA APP
/***************************************************************************************************/

import * as util from './utils/rutas';
app.config(['$routeProvider', util.configurarRutas]);

app.run(['$rootScope','$http','$location','$q','$uibModal','PendingRequestsResource',($rootScope,$http,$location,$q,$uibModal,PendingRequestsResource) => {
  return new util.CambioDeRuta($rootScope,$http,$location,$q,$uibModal,PendingRequestsResource);
}]);


app.config([
    function() {
        XMLHttpRequest.prototype.setRequestHeader = (function(sup) {
            return function(header, value) {
                if ((header === "__XHR__") && angular.isFunction(value))
                    value(this);
                else
                    sup.apply(this, arguments);
            };
        })(XMLHttpRequest.prototype.setRequestHeader);
    }
]);


/***************************************************************************************************
                                IMPORTACIÓN DE FILTERS
/***************************************************************************************************/

import {Bytes} from './filters/bytes';
import {ifEmpty} from './filters/ifEmpty';

app.filter('bytes',Bytes);
app.filter('ifEmpty',ifEmpty);

/***************************************************************************************************
                                IMPORTACIÓN DE DIRECTIVAS
/***************************************************************************************************/

import {ClickDetail} from './directives/clickDetail';
import {Fragmentos} from './directives/fragmentos';
import {BtnAnadirCarga} from './directives/btnAnadirCarga';

app.directive('detalles',ClickDetail.factory());
app.directive('fragmentos',Fragmentos.factory());
app.directive('btnAnadirCarga',BtnAnadirCarga.factory());

app.directive('disableSubmit',function(){
  return {
    link:function(scope,element,attrs){
      element.on("submit",function(event){
        console.log(event)
        event.preventDefault();
      })
    }
  }
});



/** *  Abre un modal  e standar ***/
export function abrirModalEstandar($uibModal,modal,$q): any{

  var deferred = $q.defer();
  var modalInstance = $uibModal.open({
    animation: true,
    templateUrl: './templates/modal-estandar.html',
    controller: 'modalEstandarControl as mc',
    resolve: {
      items: function () {
        return modal;
      }
    }
  });

  modalInstance.result.then(function (result) {
    deferred.resolve(result);
  }, function () {
    deferred.reject(false);
  });

  return deferred.promise;

};

/*** Abre un modal para consular el estado de la carga ***/
export function abrirModalEstadoCarga($uibModal,modal): void{


  var modalInstance = $uibModal.open({
    animation: true,
    templateUrl: './templates/modal-estado-carga.html',
    controller: 'modalEstadoCargaControl as mc',
    size : 'lg',
    resolve: {
      items: function () {
        return modal;
      }
    }
  });

  modalInstance.result.then(function () {
    //modal aceptar
  }, function () {
    //modal cancelar
  });
};

import oauthSignature  from 'oauth-signature';

export function firmarPeticion(autorizacion,url,consumerKey = '',consumerSecret = '',metodo = "GET",innerParam:any = null): any{

    if (!autorizacion){
      var $oauth: any = {};
      $oauth = {
        oauth_consumer_key 		  : consumerKey,
        oauth_nonce  			      : Math.floor(Math.random()*1000000000).toString(),
        oauth_timestamp 		    : Math.floor((new Date).getTime()/1000),
        oauth_signature_method 	: "HMAC-SHA1",
        oauth_version 			    : "1.0"
      };

      if(innerParam !== null){
        for(var p in innerParam){
          $oauth[p] = innerParam[p];
        }
      }
      $oauth.oauth_signature = oauthSignature.generate(metodo,url,$oauth,consumerSecret,null,null);


      if(innerParam){
        url += "&oauth_consumer_key="+$oauth.oauth_consumer_key;
      }else{

        url += "?oauth_consumer_key="+$oauth.oauth_consumer_key;
      }
      url += "&oauth_nonce="+$oauth.oauth_nonce;
      url += "&oauth_timestamp="+$oauth.oauth_timestamp;
      url += "&oauth_signature_method="+$oauth.oauth_signature_method;
      url += "&oauth_version="+$oauth.oauth_version;
      url += "&oauth_signature="+$oauth.oauth_signature;
    }


      return url;
  };


/*** DESACTIVA EL DUBUG ***/
app.config(['$compileProvider', function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}]);

/*** DESACTIVA EL CONSOLE.LOG SI NO ESTAS EN DESARROLLO***/
if(window.location.href.indexOf("127.0.0.1") === -1 && window.location.href.indexOf("localhost") === -1){
  console.log = function() {};
}
