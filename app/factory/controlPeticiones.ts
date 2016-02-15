

/** Class PeticionesPendientesFactory. */
export class PeticionesPendientesFactory{

  pending;
  /**
   * Crea la factory PeticionesPendientesFactory.
   */
  constructor(){
    this.pending = [];
  }

  /**
   * Devuelve todas las peticiones pendientes
   */
  public get() {
    return this.pending;
  }

  /**
   * Añade una petición pendiente
   */
  public add(request) {
    this.pending.push(request);
  }

  /**
   * Elimina una petición pendiente
   * @param {object} request - petición a eliminar.
   */
  public remove(request) {
    var self = this;
    for(var i = 0;i<self.pending.length;i++){
      if(self.pending[i].url == request){
        self.pending.splice(i,1);
      }
    }
  }

  /**
   * Resuelve todas las peticiones.
   */
  public cancelAll(url) {
    var self = this;
    url = url || "";
    angular.forEach(self.pending, function(p) {
      if(url === ""){
        p.canceller.resolve("cancelado");
      }else{
        if(p.url.indexOf(url) > -1){
            p.canceller.resolve("cancelado");
        }
      }

    });
    self.pending.length = 0;
  }

  /**
   * Devuelve el tamaño del array de peticiones.
   * @return {number}
   */
  public getSize(){
    return this.pending.length;
  }

}

/*** Factoria que controla las peticiones HTTP ***/
/*
app.factory('PendingRequestsResource',() : IPendingRequestsResource => {
  return new PeticionesPendientesFactory();
});*/
