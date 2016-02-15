import * as shapes from "../app";
var app = shapes.app;



/*** Configuracion de las rutas d ela aplicaión ***/
export function configurarRutas($routeProvider): void{
    $routeProvider.
    when('/cargaExpress', {templateUrl: './views/cargaExpress.html',  controller: 'cargaExpressControl as cc'}).
    when('/listasCargas', {templateUrl: './views/listarCargas.html',  controller: 'listasCargasControl as lc'}).
    when('/descargas', {templateUrl: './views/descargas.html',   controller: 'descargasControl as dc'}).
    otherwise({redirectTo: '/cargaExpress' });
}


export class CambioDeRuta{

  $rootScope;
  $http;
  $location;
  $q;
  $uibModal;
  PendingRequestsResource;
  static $inject = ['$rootScope','$http','$location','$q','$uibModal','PendingRequestsResource'];
  constructor($rootScope,$http,$location,$q,$uibModal,PendingRequestsResource){
    this.$rootScope = $rootScope;
    this.$http = $http;
    this.$location = $location;
    this.$q = $q;
    this.$uibModal = $uibModal;
    this.PendingRequestsResource = PendingRequestsResource;
    var self = this;

    self.$rootScope.$on('$routeChangeStart', function(event, next, current){
        if(typeof current != "undefined"){
          if(current.hasOwnProperty("$$route")){
            if(current.$$route.originalPath === "/cargaExpress" && (next.$$route.originalPath === "/listasCargas" || next.$$route.originalPath == "/descargas") ){
              if(self.PendingRequestsResource.getSize() > 0){
                event.preventDefault();
                var modal = {
                  titulo:"ALERTA",
                  cuerpo:"Actualmente se está cargando un fichero. ¿Desea continuar?",
                  mostrarAceptar:true,
                  mostrarCancelar : true,
                  btnCancelar:"No",
                  btnAceptar:"Si"
                }
                shapes.abrirModalEstandar(self.$uibModal,modal,self.$q)
                .then(function() {
                  self.PendingRequestsResource.cancelAll();
                  self.$location.path(next.$$route.originalPath);
                });
              }
            }
          }
        }

    });

    window.onbeforeunload = function(e){
      if(self.PendingRequestsResource.getSize() > 0){
        return "Actualmente se está cargando un fichero. ¿Desea abandonar la página?"
      }
    };
  }

}
