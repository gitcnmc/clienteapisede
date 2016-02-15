

/** Class CredencialesFactory. */
export class CredencialesFactory{

  consumerKey;
  consumerSecret;
  recordar;
  nif;
  nif_presentador;
  $timeout;

  /**
   * Crea la factory CredencialesFactory.
   * @param {object} $timeout - ng.ITimeoutService
   */

  static $inject = ['$timeout'];
  constructor($timeout){
    this.consumerKey = "";
    this.consumerSecret = "";
    this.recordar = false;
    this.nif = "";
    this.nif_presentador = "";
    this.$timeout = $timeout;

  }
  public recordarCredenciales = () => {
    var self = this;

    if(localStorage.getItem(localStorage.getItem("entorno")+'_consumerKey') != null && localStorage.getItem(localStorage.getItem("entorno")+'_consumerSecret') != null){
      self.consumerKey = localStorage.getItem(localStorage.getItem("entorno")+'_consumerKey');
      self.consumerSecret = localStorage.getItem(localStorage.getItem("entorno")+'_consumerSecret');
      self.recordar = true;
    }else{
      self.recordar = false;
    }
  }

  public guardarCredenciales = () : void => {
    var self = this;
    if(self.consumerKey > "" && self.consumerSecret > ""){
      if(self.recordar){
        localStorage.setItem(localStorage.getItem("entorno")+'_consumerKey',self.consumerKey);
        localStorage.setItem(localStorage.getItem("entorno")+'_consumerSecret',self.consumerSecret);
      }else{
        localStorage.removeItem(localStorage.getItem("entorno")+'_consumerKey');
        localStorage.removeItem(localStorage.getItem("entorno")+'_consumerSecret');
      }
    }
  }
}
