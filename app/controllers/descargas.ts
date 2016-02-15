import * as shapes from "../app";
var app = shapes.app;


/** Class DescargasControl. */
export class DescargasControl{

  /**
   * Crea el controlador DescargasControl.
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
   uiGridConstants;
   catalogo;

   static $inject = ['$q', '$scope', '$uibModal', 'tabla', 'ConsumidorResource', 'AlertaResource', 'CredencialesResource', 'EntornoResource', '$rootScope', 'OauthResource', 'uiGridConstants','catalogo'];
   constructor($q, $scope, $uibModal, tabla, ConsumidorResource, AlertaResource, CredencialesResource, EntornoResource, $rootScope, OauthResource, uiGridConstants,catalogo){
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
    this.$rootScope = $rootScope;
    this.oauth = OauthResource;
    this.$scope.gridOptions = this.tabla.generarTablaDescargas();
    this.$scope.catalogo = catalogo;
    this.$scope.estados = {
    data: [
      { value: "DISPONIBLE", choice: "DISPONIBLE" },
      { value: "DESCARGADO", choice: "DESCARGADO" }
    ],
    selected: "DISPONIBLE"
    };

    this.$scope.procedimientos = {
      data : [{value:"1",choice:"SGDA"}],
      selected : "1"
    };


    var self = this;

    //evento listar_descargas
    this.$rootScope.$on('listar_descargas', function(event, args) {

      self.listarDescargas();
    });

    //se valida credenciales al iniciar el controller

    if(!window.hasOwnProperty("test")){

      this.oauth.validarCredenciales()
        .then(function(){
        self.$scope.catalogo.listarProcedimientos()
          .then(function(){
            self.listarDescargas();
          })
          self.credenciales.guardarCredenciales();
        });
    }


  }

  /**
   * Lista las descarga en una tabla.
   */
  public listarDescargas(): void{

    var self = this;
    var requestParam = {
      estado : self.$scope.estados.selected,
      nifEmpresa : self.credenciales.nif,
      idProcedimiento : self.$scope.catalogo.procedimientos.selected
    }


      var res = self.consumidor.listarDescargas(requestParam);
      res
        .success(function(data){
          data = self.arreglarFechasDescargas(data);
          self.$scope.gridOptions.data = data;
          console.log(self.$scope.gridOptions)
          self.alerta.eliminar(self.$scope);
        })
        .error(function(error){
          self.$scope.gridOptions.data = [];
          self.alerta.anadir(self.$scope,error);

        });

  }

  /**
   * Modifica las fechas string a fechas integer( getTime() )
   * @param {object} data - listado de descargas
   * @return {object} data - listado de descargas
   */
  public arreglarFechasDescargas(data){
      for(var i = 0;i<data.length;i++){
        if(data[i].fechaCaducidad !== null && data[i].fechaCaducidad !== undefined){
          data[i].fechaCaducidad = new Date(data[i].fechaCaducidad.replace(' ','T')).getTime();
        }

        if(data[i].fechaDisponibilidad !== null && data[i].fechaDisponibilidad !== undefined){
          data[i].fechaDisponibilidad = new Date(data[i].fechaDisponibilidad.replace(' ','T')).getTime();
        }

      }
      return data;
  }

  /**
   * Cierra las alertas
   * @param {number} index - $index (angular)
   */
  public closeAlert(index): void{
    this.alerta.cerrar(this.$scope,index);
  }
}
