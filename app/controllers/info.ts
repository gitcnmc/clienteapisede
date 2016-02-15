
/** Class InfoController. */
export class InfoController{

    $scope;
  /**
   * Crea el controlador InfoController.
   * @param {object} $scope - ng.IScope
   */
  static $inject = ['$scope'];
  constructor($scope){
    this.$scope = $scope;
    this.$scope.mostrarInfo = false;
    if(localStorage.getItem("oculto") === "info"){
      this.$scope.mostrarInfo = false;
    }else{
      this.$scope.mostrarInfo = true;
    }
  }
  /**
   * Oculta el panel de información.
   * Guarda la ocultación en localStorage.
   */
  public ocultarInfo(): void{
    this.$scope.mostrarInfo = false;
    localStorage.setItem('oculto','info');
  }
}
