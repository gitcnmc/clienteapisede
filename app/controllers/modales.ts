
/** Class ModalEstandarControl. */
export class ModalEstandarControl{

  $scope;
  $uibModalInstance;

  /**
   * Crea el controlador ModalEstandarControl.
   * @param {object} $scope - ng.IScope
   * @param {object} $uibModalInstance - $uibModalInstance provider
   * @param {object} items - elementos del modal
   */
  static $inject = ['$scope','$uibModalInstance','items'];
  constructor($scope,$uibModalInstance,items){
    this.$scope = $scope;
    this.$uibModalInstance = $uibModalInstance;
    this.$scope.mensaje = items;
  }

  /**
   * Acepta el modal.
   */
  public ok(res): void{
    this.$uibModalInstance.close(res);
  };

  /**
   * Cancela el modal.
   */
  public cancel(): void{
    this.$uibModalInstance.dismiss('cancel');
  };

}


/** Class ModalEstadoCargaControl. */
export class ModalEstadoCargaControl{

  $scope;
  $uibModalInstance;
  /**
   * Crea el controlador ModalEstandarControl.
   * @param {object} $scope - ng.IScope
   * @param {object} $uibModalInstance - $uibModalInstance provider
   * @param {object} items - elementos del modal
   */

  static $inject = ['$scope','$uibModalInstance','items'];
  constructor($scope,$uibModalInstance,items){
    this.$scope = $scope;
    this.$uibModalInstance = $uibModalInstance;
    this.$scope.modal = items;
  }

  /**
   * Cancela el modal.
   */
  public cancel(): void{
    this.$uibModalInstance.dismiss('cancel');
  }

}

/** Class ModalOpcionesCargaControl. */
export class ModalOpcionesCargaControl{

  $scope;
  $uibModalInstance;
  /**
   * Crea el controlador ModalOpcionesCargaControl.
   * @param {object} $scope - ng.IScope
   * @param {object} $uibModalInstance - $uibModalInstance provider
   */
   static $inject = ['$scope','$uibModalInstance','items'];
   constructor($scope,$uibModalInstance,items){
    this.$scope = $scope;
    this.$uibModalInstance = $uibModalInstance;
    this.$scope.modal = items;
    this.$scope.tipoSubida = "simple";
    this.$scope.tamanio_elegido = 0;
    if(items.hasOwnProperty("partes")){
      if(items.partes.length > 0){
        this.$scope.tamanio_elegido = parseInt(items.partes[0].size/1048576);
        this.$scope.tipoSubida = "truncada";
      }
    }
  }

  /**
   * Acepta el modal.
   */
  public ok(tipoSubida,tamanio_elegido): void{

    this.$uibModalInstance.close([tipoSubida,tamanio_elegido]);
  };

  /**
   * Cancela el modal.
   */
  public cancel(): void{
    this.$uibModalInstance.dismiss('cancel');
  };

}
