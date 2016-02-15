
/** Class EntornoFactory. */
export class EntornoFactory{

  estado;
  autorizacion;

  /**
   * Crea la factory EntornoFactory.
   */
  constructor(){

    this.estado = false;
    this.autorizacion = false;


    if(localStorage.getItem(localStorage.getItem("entorno")+'_oauthActivado') != null){
      if(localStorage.getItem(localStorage.getItem("entorno")+'_oauthActivado') != 1){
        this.autorizacion = true;
      }else{
        this.autorizacion = false;
      }
    }
  }



  /**
   * Devuelve la url para consumir rest dependiendo del estado.
   * @param {string} url
   */
  public conseguir_url(){
    return (this.estado) ? localStorage.getItem("produccion") : localStorage.getItem("preproduccion");
  }

}
