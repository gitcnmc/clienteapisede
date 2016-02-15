

/** Class CatalogoFactory. */
export class CatalogoFactory{

  procedimientos;
  tipoFicheros;
  fechaEfecto;
  consumidor;
  $q;

  /**
   * Crea la factory CatalogoFactory.
   * @param {object} consumidor - ConsumidorResource
   */

  static $inject = ['$consumidor','$q'];
  constructor(consumidor,$q){
    this.procedimientos = [];
    this.tipoFicheros = [];
    this.consumidor = consumidor;
    this.fechaEfecto = {
      opened : false,
      selected : null,
      dateOptions : {
        startingDay : 1,
        formatYear : 'yyyy',
        showWeeks : false
      }
    }
    this.$q = $q;
  }

  public listarProcedimientos(){
    var self = this;
    var deferred = self.$q.defer();
    self.consumidor.listarProcedimientos()
      .then(function(res){
        self.procedimientos.data = (angular.isArray(res.data)) ? res.data : [];
        self.procedimientos.selected = (self.procedimientos.data.length > 0) ? res.data[0].idProcedimiento.toString() : "";
        self.listarTipoFicheros(self.procedimientos.selected)
          .then(function(){
            deferred.resolve();
          });
      });

    return deferred.promise;
  }

  public listarTipoFicheros(idProcedimiento){
    var self = this;
    var deferred = self.$q.defer();
    self.consumidor.listarTipoFicheros(idProcedimiento)
      .then(function(res){
        self.tipoFicheros.data = (angular.isArray(res.data)) ? res.data : [];
        self.tipoFicheros.selected = null;
        deferred.resolve();
      });
    return deferred.promise;
  }

  public vaciarCatalogo(){
    this.procedimientos = [];
    this.procedimientos.selected = null;
    this.tipoFicheros = [];
    this.tipoFicheros.selected = null;
    this.fechaEfecto = {
      opened : false,
      selected : null
    }
  }

  public isDate(): boolean{
    var self = this;
    if(self.fechaEfecto.selected != null){
      return angular.isDate(self.fechaEfecto.selected)
    }else{
      return true;
    }

  }
}
