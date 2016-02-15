import * as shapes from "../app";
var app = shapes.app;

/** Class PanelEntornoControl. */
export class PanelEntornoControl {

  credenciales;
  entorno;
  consumidor;
  $scope;
  $uibModal;
  $q;
  $location;
  $rootScope;
  oauth;
  $window;

  /**
   * Crea el controlador PanelEntornoControl.
   * @param {object} $q - ng.IQService
   * @param {object} $scope - ng.IScope
   * @param {object} $uibModal - $uibModal provider
   * @param {object} $location - ng.IlocationService
   * @param {object} ConsumidorResource - Factory
   * @param {object} CredencialesResource - Factory
   * @param {object} EntornoResource - Factory
   * @param {object} $rootScope - ng.IRootScope
   */
  static $inject = ['$q','$scope','$uibModal','$location','ConsumidorResource','CredencialesResource','EntornoResource','$rootScope','OauthResource','catalogo','$window'];
  constructor($q,$scope,$uibModal,$location,ConsumidorResource,CredencialesResource,EntornoResource,$rootScope,OauthResource,catalogo,$window){
    this.credenciales = CredencialesResource;
    this.entorno = EntornoResource;
    this.consumidor = ConsumidorResource;
    this.$scope = $scope;
    this.$scope.credenciales = this.credenciales;
    this.$scope.entorno = this.entorno;
    this.$uibModal = $uibModal;
    this.$q = $q;
    this.$location = $location;
    this.$rootScope = $rootScope;
    this.oauth = OauthResource;
    this.$scope.catalogo = catalogo;
    this.$window = $window;
    var self = this;
    if (localStorage.getItem("preproduccion") == null){
      localStorage.setItem("preproduccion","https://apipre.cnmc.gob.es/");
    }
    if (localStorage.getItem("produccion") == null){
      localStorage.setItem("produccion","https://api.cnmc.gob.es/");
    }


    //se decide el entorno
    if(this.$location.$$absUrl.indexOf('api.cnmc.gob.es') > -1){
      this.entorno.estado = true;
      localStorage.setItem("entorno","produccion");
    }else{
      this.entorno.estado = false;
      localStorage.setItem("entorno","preproduccion");
    }

    this.$scope.$parent.footer = localStorage.getItem(localStorage.getItem("entorno"));

    self.$scope.$watch(function(){
      return self.$window.localStorage;
    }, function(newCodes, oldCodes){
      self.$scope.$parent.footer = self.$window.localStorage.getItem(self.$window.localStorage.getItem('entorno'));
    });


    if (!window.hasOwnProperty("test")) {
    this.$scope.credenciales.recordarCredenciales(this.entorno.autorizacion);
    }

  }

  /**
   * Emite el evento correspondiente segun donde se encuentre la app
   */
  public listar(): void{
    var self = this;
    if(self.$location.$$path === "/descargas"){
      self.$rootScope.$broadcast("listar_descargas");
    }else if(self.$location.$$path === "/listasCargas"){
      self.$rootScope.$broadcast("listar_cargas");
    }
  }

  public isActive(path): boolean{
    var self = this;
    return (self.$location.$$path == path);

  }

  /**
   * Valida las credenciales Oauth / HTTPS
   */
  public pedirNif(): void{
    var self = this;
    this.oauth.validarCredenciales()
      .then(function(){
        self.$scope.catalogo.listarProcedimientos()
          .then(function(){
            self.listar();
          }) ;
        self.credenciales.guardarCredenciales();
      },function(){
        shapes.abrirModalEstandar(self.$uibModal,{
          titulo:"ERROR",
          cuerpo:"Compruebe sus credeciales Oauth",
          mostrarAceptar:false,
          mostrarCancelar : true,
          btnCancelar:"Cerrar"
        },self.$q);
      })

  }

  /**
   * Valida las credenciales Oauth / HTTPS y Cambia de entorno
   * @param {string} boton - tipo de boton pulsado
   */
  public cambiarEstadoBoton(boton): void{
    var self = this;
    if(boton === "entorno"){
      var ent =  (self.entorno.estado) ? "preproducción" : "producción";
      var modal = {
        titulo:"ALERTA",
        cuerpo:"Le redirigimos a "+ ent +". ¿Desea continuar?",
        mostrarAceptar:true,
        mostrarCancelar : true,
        btnCancelar:"No",
        btnAceptar:"Si"
      }
      shapes.abrirModalEstandar(self.$uibModal,modal,self.$q)
      .then(function(result) {

        if((self.$location.$$host === 'localhost' || self.$location.$$host === '127.0.0.1') && result ){

          if(!self.entorno.estado){
            localStorage.setItem('entorno','preproduccion');
          }else{
            localStorage.setItem('entorno','produccion');
          }
          self.$scope.$parent.footer = localStorage.getItem(localStorage.getItem("entorno"));

        }else if(result){
          if(!self.entorno.estado){
            window.location.assign("https://apipre.cnmc.gob.es/cargador/");
          }else{
            window.location.assign("https://api.cnmc.gob.es/cargador/");
          }
        }else{
          self.entorno.estado = !self.entorno.estado;
        }

      });


    }else if(boton === "autorizacion"){
      self.credenciales.nif = "";
      self.credenciales.nif_presentador = "";

      if(self.entorno.autorizacion){
          self.entorno.autorizacion = false;
          localStorage.setItem(localStorage.getItem("entorno")+'_oauthActivado',"1");
          self.credenciales.recordarCredenciales(self.entorno.autorizacion);
          this.oauth.validarCredenciales()
            .then(function(){
              self.$scope.catalogo.listarProcedimientos()
                .then(function(){
                  self.listar();
                });
            },function(){
                self.listar();
                self.$scope.catalogo.vaciarCatalogo();
            })
      }else{
        self.entorno.autorizacion = true;
        localStorage.setItem(localStorage.getItem("entorno")+'_oauthActivado',"0");
        this.oauth.validarCredenciales()
          .then(function(){
            self.$scope.catalogo.listarProcedimientos()
              .then(function(){
                self.listar();
              });
          },function(){
            self.listar();
            self.$scope.catalogo.vaciarCatalogo();
            shapes.abrirModalEstandar(self.$uibModal,{
              titulo:"ERROR",
              cuerpo:"Compruebe su certificado HTTPS",
              mostrarAceptar:false,
              mostrarCancelar : true,
              btnCancelar:"Cerrar"
            },self.$q);
          })
      }
    }
  }


}
