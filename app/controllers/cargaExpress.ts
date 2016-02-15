import * as shapes from "../app";

/**  Class CargaExpressControl. */
export class CargaExpressControl {

  $q;
  $scope;
  $uibModal;
  tabla;
  consumidor;
  alerta;
  pendingRequest;
  credenciales;
  entorno;
  oauth;
  uiGridConstants;
  catalogo;

  /**
   * Crea el controlador CargaExpressControl.
   * @param {object} $q - ng.IQService
   * @param {object} $scope - ng.IScope
   * @param {object} $uibModal - $uibModal provider
   * @param {object} TablaResource - Factory
   * @param {object} ConsumidorResource - Factory
   * @param {object} AlertaResource - Factory
   * @param {object} PendingRequestsResource - Factory
   * @param {object} CredencialesResource - Factory
   * @param {object} EntornoResource - Factory
   */

  static $inject = ['$q','$scope','$uibModal','tabla','ConsumidorResource','AlertaResource','PendingRequestsResource','CredencialesResource','EntornoResource','OauthResource','uiGridConstants','catalogo'];
  constructor($q,$scope,$uibModal,tabla,ConsumidorResource,AlertaResource,PendingRequestsResource,CredencialesResource,EntornoResource,OauthResource,uiGridConstants,catalogo){
    this.$q = $q;
    this.$scope = $scope;
    this.$uibModal = $uibModal;
    this.tabla = tabla;
    this.consumidor = ConsumidorResource;
    this.alerta = AlertaResource;
    this.pendingRequest = PendingRequestsResource;
    this.credenciales = CredencialesResource;
    this.entorno = EntornoResource;
    this.$scope.credenciales = this.credenciales;
    this.$scope.entorno = this.entorno;
    this.$scope.alerta = this.alerta;
    this.oauth = OauthResource;
    this.uiGridConstants = uiGridConstants;
    this.$scope.gridOptions = this.tabla.generarTablaCargas(this.$scope);
    this.$scope.gridOptions.data = this.tabla.cargas;
    this.$scope.catalogo = catalogo;

    var self = this;
    //se valida credenciales al iniciar el controller
    if(!window.hasOwnProperty("test")){
      this.oauth.validarCredenciales()
        .then(function(){
          self.$scope.catalogo.listarProcedimientos();
        });
    }

  }


  /**
    * Abre el modal de opciones carga.
    * @param {object} fichero - Flow file.
    */
  public abrirModalOpciones(row,grid): void{
    var fichero = row.entity;
    var self = this;
    var modalInstance = self.$uibModal.open({
      animation: true,
      templateUrl: './templates/modal-opciones-carga.html',
      controller: 'modalOpcionesCargaControl as mc',
      size : 'lg',
      resolve: {
        items: function () {
          return fichero;
        }
      }
    });

    modalInstance.result.then(function (result) {
      var BYTES_PER_CHUNK = result[1];
      var tipoSubida = result[0];
      if(tipoSubida == 'truncada'){
        var SIZE = fichero.size;
        BYTES_PER_CHUNK = parseInt(BYTES_PER_CHUNK*1048576);
        var NUM_CHUNKS = Math.max(Math.ceil(SIZE / BYTES_PER_CHUNK), 1);
        fichero.partes = [];
        for(var i = 0;i<NUM_CHUNKS;i++){
          if(i == NUM_CHUNKS - 1){
            BYTES_PER_CHUNK = fichero.size - (BYTES_PER_CHUNK * (NUM_CHUNKS - 1) );
          }
          fichero.partes.push({
            progress : 0,
            progressParar : false,
            name : fichero.name+"_parte"+i,
            size : BYTES_PER_CHUNK
          });
        }

        if(!row.isExpanded){
          grid.api.expandable.toggleRowExpansion(fichero);
        }else{
          grid.api.expandable.toggleRowExpansion(fichero);
          grid.api.expandable.toggleRowExpansion(fichero);
        }

      }else{
        if(row.isExpanded){
          grid.api.expandable.toggleRowExpansion(fichero);
        }
        fichero.partes = [];
      }

      fichero.subGridOptions.data = fichero.partes;

    });

  }

  /**
    * Añade a la tabla el archivo elegido para subir.
    * @param {object} file - file object
    */
  public anadirCarga($file:any): void{
    var self = this;

    $file.progress = 0;
    $file.partes = [];

    $file.subGridOptions = {
      enableMinHeightCheck: true,
      showHeader: false,
      data: $file.partes,
      enableColumnMenus : false,
      gridMenuShowHideColumns : false,
      enableFiltering: false,
      enableHorizontalScrollbar  : self.uiGridConstants.scrollbars.NEVER,
      enableVerticalScrollbar   :  self.uiGridConstants.scrollbars.NEVER,
      enableExpandableRowHeader : false,
      rowHeight: 47,
      columnDefs: [
        { headerCellClass:'header-table-cnmc', cellClass : 'detail',field: ' ', displayName : ' ', width:'5%'},
        { headerCellClass:'header-table-cnmc', cellClass : 'detail',field: 'name', displayName : 'Fichero', width:'25%', cellTemplate : '<div class="ui-grid-cell-contents"><span style="margin-left:10px;"></span>{{row.entity.name}}</div>'},
        { headerCellClass:'header-table-cnmc', cellClass : 'detail',field: 'size', displayName: 'Tamaño', width: '10%', cellTemplate : '<div class="ui-grid-cell-contents">{{row.entity.size | bytes}}</div>'},
        { headerCellClass:'header-table-cnmc', cellClass : 'detail',field: ' ', displayName: 'Proceso de Carga', width: '35%', cellTemplate : './templates/ui-grid/carga.progreso.html' },
        { headerCellClass:'header-table-cnmc', cellClass : 'detail',field: ' ', displayName: ' ', width: '15%'},
        { headerCellClass:'header-table-cnmc', cellClass : 'detail',field: ' ', displayName: ' ', width: '10%'}
      ]
    }
    self.tabla.cargas.push($file);
    //self.$scope.gridOptions.data.push($file);
    //self.$scope.gridOptions.gridHeight = 30 + (self.$scope.gridOptions.data.length * 47);

    self.$scope.$apply();
  }

  /**
    * Cierra las alertas.
    * @param {number} index - $index (angular)
    */
  public closeAlert(index): void{
    var self = this;
    self.alerta.cerrar(self.$scope,index);
  }

  public parametrosRellenos(): boolean{
    var self = this;
    var modalEstandar = {
        titulo : "ALERTA",
        mostrarAceptar : false,
        mostrarCancelar : true,
        btnCancelar : "CERRAR",
        cuerpo : ""
    }
    if(self.credenciales.nif === ""){
      self.alerta.anadir(self.$scope,{Error:"El campo Nif Empresa está incompleto"});
    }else if(self.credenciales.nif_presentador === ""){
      self.alerta.anadir(self.$scope,{Error:"El campo Nif Presentador está incompleto"});
    }else if(self.$scope.catalogo.procedimientos.selected == null || self.$scope.catalogo.procedimientos.selected === ""){
      self.alerta.anadir(self.$scope,{Error:"No hay ningún Procedimiento seleccionado"});
    }else if(self.$scope.catalogo.tipoFicheros.selected == null || self.$scope.catalogo.tipoFicheros.selected === ""){
      self.alerta.anadir(self.$scope,{Error:"No hay ningún Tipo de Fichero seleccionado"});
    }else{
      return true;
    }
  }

  /**
    * Elimina de la tabla de cargas el archivo.
    * Cancela la carga si esta iniciada.
    * @param {object} $flowFile - file del objecto Flow
    * @param {object} index - $index (angular)
    * @param {object} $flow - Flow object
    */
  public eliminarCarga($file,row): void{
    var self = this;
    var index = self.$scope.gridOptions.data.indexOf(row.entity);
    if($file.iniciarCarga && $file.progress !== 100){
      $file.progressParar = true;
      self.cancelarCarga($file);
    }
    self.$scope.gridOptions.data.splice(index,1);

  }

  /**
    * Inicia la carga del fichero.
    * @param {object} $flowFile - file del objecto Flow
    * @param {bool} test - para saber si estamos en el test.
    */
  public iniciarCarga($file:any,test: boolean = false): void{
    var self = this;
    var fileTrozeado = false;

    if(typeof $file.partes != "undefined"){
      if($file.partes.length > 0){
        fileTrozeado = true;
      }
    }

    if(self.parametrosRellenos()){ //se comprubea que los parametros esten rellenos.
      if($file.iniciarCarga){ //si la carga se ha iniciado se cancela la carga.
        self.cancelarCarga($file);

      }else if($file.hasOwnProperty("uuidCarga")){ // si la carga tiene uuidCarga, se inicia la subida del fichero.
          if(fileTrozeado){
            self.iniciarCargaFichero($file);
          }else{
            self.subirFicheroCompleto($file);
          }
      }else{

        var requestParam = {
          nifEmpresa:self.credenciales.nif,
          idProcedimiento:self.$scope.catalogo.procedimientos.selected,
          nifPresentador:self.credenciales.nif_presentador
        }
        if(angular.isDate(self.$scope.catalogo.fechaEfecto.selected)){
          requestParam.fechaEfecto = self.$scope.catalogo.fechaEfecto.selected
        }
        var res = self.consumidor.iniciarCarga(requestParam);
        res
          .success(function(data){
            $file.progressParar = false;
            $file.uuidCarga = data.uuidCarga;
            if(!test){
              self.alerta.eliminar(self.$scope);
              if(fileTrozeado){
                self.iniciarCargaFichero($file);
              }else{
                self.subirFicheroCompleto($file);
              }
            }

          })
          .error(function(error){
            self.alerta.anadir(self.$scope,error);
            $file.progressParar = true;
            $file.iniciarCarga = false;
            if (fileTrozeado) {
              for (var i = 0; i < $file.partes.length;i++){
                $file.partes[i].progressParar = false;
                $file.partes[i].iniciarCarga = false;
              }
            }
          });
      }
    }

  }

  /**
    * Inicia la carga del fichero truncado.
    * @param {object} $flowFile - file del objecto Flow
    * @param {bool} test - para saber si estamos en el test.
    */
  public iniciarCargaFichero($file:any,test: boolean = false): void{
    var self = this;

    var requestParam = {
      uuidCarga:$file.uuidCarga,
      tipoFichero:self.$scope.catalogo.tipoFicheros.selected,
      nombreFichero:$file.name,
      numeroBytes : $file.size
    }
    for(var i = 0;i<$file.partes.length;i++){
      $file.partes[i].progressParar = false;
    }
    var res = self.consumidor.iniciarCargaFichero(requestParam);
    res
      .success(function(data){

          $file.uuidUpload = data.uuidUpload;
          if(!test){
            self.subirChunkFicheroCompleto($file)
              .then(function(result){
                if(result.indexOf("cancelado") === -1){
                  $file.progress = 100;
                  self.confirmarSubidaFichero($file);
                }

              });
          }
          self.alerta.eliminar(self.$scope);

      })
      .error(function(error){
        $file.progressParar = true;
        $file.iniciarCarga = false;
        self.alerta.anadir(self.$scope,error);
      });
  }


  /**
    * Cancela la carga del fichero.
    * @param {object} $flowFile - file del objecto Flow
    */
  public cancelarCarga($file): void{
    var self = this;
    $file.progressParar = true;
    $file.iniciarCarga = false;
    var param = {
      uuidCarga : $file.uuidCarga
    }

    var fileTrozeado = false;
    if(typeof $file.partes != "undefined"){
      if($file.partes.length > 0){
        fileTrozeado = true;
      }
    }

    if(fileTrozeado){
      for(var i = 0;i<$file.partes.length;i++){
        $file.partes[i].progressParar = true;
      }
      self.pendingRequest.cancelAll($file.uuidUpload);
    }else{
      self.pendingRequest.cancelAll($file.uuidCarga);
    }

    self.pendingRequest.cancelAll();
    var res = self.consumidor.cancelarCarga(param);
    res.$promise
      .then(function(data){
        self.alerta.eliminar(self.$scope);
      },function(error){
        self.alerta.anadir(self.$scope,error);
      });

  }

  /**
    * Sube el fichero completo
    * @param {string} uuidCarga - uuid de carga
    * @param {object} $flowFile - file del objecto Flow.
    * @param {bool} test - para saber si estamos en el test.
    */
  public subirFicheroCompleto($file:any,test = false): void{
    var self = this;
    $file.progressParar = false;
    $file.iniciarCarga = true;
    $file.progress = "0 %;";

    var paramRequest = {
      uuidCarga:$file.uuidCarga,
      tipoFichero: self.$scope.catalogo.tipoFicheros.selected,
      nombreFichero:$file.name,
      numeroBytes:$file.size
    }
    var promesa = self.consumidor.subirFicheroCompleto(paramRequest,$file);

    promesa
      .then(function(data){

        if(data !== "cancelado" && !test){
          self.confirmarCarga($file);
          self.alerta.eliminar(self.$scope);
        }
      },function(error){
        self.alerta.anadir(self.$scope,error);
      });

  }


  /**
    * Sube el fichero completo por partes
    * @param {string} uuidUpload - uuid de upload
    * @param {object} $flowFile - file del objecto Flow.
    * @param {bool} test - para saber si estamos en el test.
    */
  public subirChunkFicheroCompleto($file:any,test = false): any{
    var self = this;

    $file.progressParar = false;
    $file.iniciarCarga = true;
    $file.progress = 0;

    var BYTES_PER_CHUNK = $file.partes[0].size;
    var SIZE = $file.size;
    var NUM_CHUNKS = Math.max(Math.ceil(SIZE / BYTES_PER_CHUNK), 1);
    var index = 0;
    var start = 0;
    var end = BYTES_PER_CHUNK;
    var promises = [];
    while (start < SIZE) {
      if(index == NUM_CHUNKS - 1){
        BYTES_PER_CHUNK = $file.size - (BYTES_PER_CHUNK * (NUM_CHUNKS - 1) );
      }

      var paramRequest = {
        uuidUpload:$file.uuidUpload,
        numeroParte: index+1,
        tamanoParte:BYTES_PER_CHUNK
      }
      $file.partes[index].progressParar = false;
      $file.partes[index].iniciarCarga = true;

      promises.push(self.consumidor.subirChunkFichero(paramRequest,$file.slice(start, end),$file.partes[index],$file));

      start = end;
      end = start + BYTES_PER_CHUNK;
      index++;

    }

    return self.$q.all(promises);

  }
  /**
    * Confirma la carga del fichero
    * @param {string} uuidCarga - uuid de carga
    * @param {object} $flowFile - file del objecto Flow.
    */
  public confirmarCarga($file:any): void{
    var self = this;
    var param = {};
    param = {
      uuidCarga : $file.uuidCarga
    }
    var res = self.consumidor.confirmarCarga(param);
    res.$promise
      .then(function(data){
        $file.mostrarEstado = true;
        self.alerta.eliminar(self.$scope);
      },function(error){
        self.alerta.anadir(self.$scope,error);
      });
  }


  public confirmarSubidaFichero($file:any,test: boolean = false): void{
    var self = this;
    var res = self.consumidor.confirmarSubidaFichero({uuidUpload:$file.uuidUpload});
    res.$promise
    .then(function(data){
      if(!test){
        self.confirmarCarga($file);
      }
    },function(error){
      self.alerta.anadir(self.$scope,error);
    });
  }
  /**
    * Consulta el estado del fichero
    * @param {object} fichero - file del objecto Flow.
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
      });

  }

}
