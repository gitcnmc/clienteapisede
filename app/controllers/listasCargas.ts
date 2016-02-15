import * as shapes from "../app";
var app = shapes.app;

/** Class ListasCargasControl. */
export class ListasCargasControl {

  $q;
  $scope;
  $uibModal;
  consumidor;
  tabla;
  alerta;
  credenciales;
  entorno;
  $rootScope;
  oauth;
  catalogo;

  /**
   * Crea el controlador ListasCargasControl.
   * @param {object} $q - ng.IQService
   * @param {object} $scope - ng.IScope
   * @param {object} $uibModal - $uibModal provider
   * @param {object} TablaResource - Factory
   * @param {object} ConsumidorResource - Factory
   * @param {object} AlertaResource - Factory
   * @param {object} CredencialesResource - Factory
   * @param {object} EntornoResource - Factory
   * @param {object} $rootScope - ng.IRootScope
   */

  static $inject = ['$q','$scope','$uibModal','tabla','ConsumidorResource','AlertaResource','CredencialesResource','EntornoResource','$rootScope','OauthResource','uiGridConstants','catalogo'];
  constructor($q,$scope,$uibModal,tabla,ConsumidorResource,AlertaResource,CredencialesResource,EntornoResource,$rootScope,OauthResource,uiGridConstants,catalogo){
    this.$q = $q;
    this.$scope = $scope;
    this.$uibModal = $uibModal;
    this.consumidor = ConsumidorResource;
    this.tabla = tabla;
    this.alerta = AlertaResource;
    this.credenciales = CredencialesResource;
    this.entorno = EntornoResource;
    this.$scope.credenciales = this.credenciales;
    this.$scope.entorno = this.entorno;
    this.$scope.alerta = this.alerta;
    this.$rootScope = $rootScope;
    this.oauth = OauthResource;
    this.$scope.gridOptions = this.tabla.generarTablaListasCargas(this.$scope);
    this.$scope.catalogo = catalogo;
    this.$scope.estados = {
      data : [{value:"TODOS",choice:"TODOS"},
      {value:"INICIADA",choice:"INICIADA"},
      {value:"CANCELADA",choice:"CANCELADA"},
      {value:"EN_PROCESO",choice:"EN_PROCESO"},
      {value:"ACEPTADA",choice:"ACEPTADA"},
      {value:"ACEPTADA_PARCIALMENTE",choice:"ACEPTADA_PARCIALMENTE"},
      {value:"RECHAZADA",choice:"RECHAZADA"}],
      selected : "TODOS"
    };

    this.$scope.procedimientos = {
      data : [{value:"1",choice:"SGDA"}],
      selected : "1"
    };

    var self = this;

    //evento listar_cargas
    this.$rootScope.$on('listar_cargas', function(event, args) {
      self.listar_cargas();
    });

    if(!window.hasOwnProperty("test") ){
      this.oauth.validarCredenciales()
        .then(function(){
          self.credenciales.guardarCredenciales();
          self.$scope.catalogo.listarProcedimientos()
            .then(function(){
              self.listar_cargas();
            });

        },function(){
          //error de la promesa
        });
    }
  }



  /**
   * Lista las cargas de ficheros
   */
  public listar_cargas(): void{
    var self = this;

    if ((self.credenciales.consumerKey > "" && self.credenciales.consumerSecret) || self.entorno.autorizacion){
      var requestParam = {
      nifEmpresa: self.credenciales.nif,
        idProcedimiento : self.$scope.catalogo.procedimientos.selected,
        nifPresentador : self.credenciales.nif_presentador,
        estado : undefined
      };

      if(self.$scope.estados.selected !== "TODOS"){
        requestParam.estado = self.$scope.estados.selected;
      }

      var res = self.consumidor.listarCargas(requestParam);
      res
        .success(function(data){
          data = self.arreglarFechasData(data);
          self.$scope.gridOptions.data = data;
          self.alerta.eliminar(self.$scope);
        })
        .error(function(error){
          console.log(error)
          self.$scope.gridOptions.data = [];
          self.alerta.anadir(self.$scope,error);

        });
    }else{
      self.$scope.gridOptions.data = [];
    }

  }

  /**
   * Modifica las fechas string a fechas integer( getTime() )
   * @param {object} data - listado de descargas
   * @return {object} data - listado de descargas
   */
  public arreglarFechasData(data){
      for(var i = 0;i<data.length;i++){
        if(data[i].fechaInicio !== null && data[i].fechaInicio !== undefined){
          data[i].fechaInicio = new Date(data[i].fechaInicio.replace(' ','T'));
          data[i].fechaInicio = data[i].fechaInicio.getTime();
        }

        if(data[i].fechaEfecto !== null && data[i].fechaEfecto !== undefined){
          data[i].fechaEfecto = new Date(data[i].fechaEfecto.replace(' ','T'));
          data[i].fechaEfecto = data[i].fechaEfecto.getTime();
        }

        if(data[i].fechaFinProceso !== null && data[i].fechaFinProceso !== undefined){
          data[i].fechaFinProceso = new Date(data[i].fechaFinProceso.replace(' ','T'));
          data[i].fechaFinProceso = data[i].fechaFinProceso.getTime();
        }

      }
      return data;
  }

  /**
   * Consulta el estado del fichero
   * @param {object} fichero
   */
  public consultarEstado(fichero): void{
    var self = this;
    var param = {};
    param = {
      uuidCarga : fichero.uuidCarga
    }

    var res = self.consumidor.consultarEstadoCarga(param);
    res.$promise
      .then(function(data){
        var modal = {
          uuidCarga : fichero.uuidCarga,
          estado : data.estado,
          registrosErrores : data.registrosErrores,
          registrosProcesados: data.registrosProcesados,
          enlace : ""
        }
        if(data.errores.length > 0){
          modal.enlace = data.errores[0].url;
        }
        shapes.abrirModalEstadoCarga(self.$uibModal,modal);
      },function(error){
        self.alerta.anadir(self.$scope,error);
      });

  }

  /**
   * Cancela una carga iniciada
   * @param {object} fichero
   */
  public cancelarCarga(fichero): void{
    var self = this;
    var param = {};
    param = {
      uuidCarga : fichero.uuidCarga
    }
    var res = self.consumidor.cancelarCarga(param);
    res.$promise
      .then(function(data){
        fichero.estado = "CANCELADA";
      },function(error){
        self.alerta.anadir(self.$scope,error);
      });

  }

  /**
   * Cierra las alertas
   * @param {number} index - $index (angular)
   */
  public closeAlert(index): void{
    var self = this;
    self.alerta.cerrar(self.$scope,index);
  }

  /**
    * Abre el modal de opciones carga.
    * @param {object} fichero - Flow file.
    */
  public abrirModalDetalles(fichero): void{
    var self = this;
    var modalInstance = self.$uibModal.open({
      animation: true,
      templateUrl: './templates/modal-detalles-carga.html',
      controller: 'modalEstadoCargaControl as mc',
      size : 'lg',
      resolve: {
        items: function () {
          return fichero;
        }
      }
    });
}

//app.controller('listasCargasControl',ListasCargasControl);
