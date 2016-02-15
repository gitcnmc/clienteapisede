
/** Class AlertaFactory. */
export class AlertaFactory{

  /**
   * Crea la factory  AlertaFactory.
   */
  constructor(){

  }

  /**
   * añade una alerta
   * @param {object} $scope - ng.IScope.
   * @param {object} msg - mensaje de la alerta.
   * @param {string} type - class de la alerta.
   */
  public anadir($scope,msg,type): void{
    type = type || "danger";
    $scope.alerts = [];
    console.log($scope,msg)
    msg = this.procesarAlerta(msg);
    $scope.alerts.push({mensajes: msg, type: type});
  }

  /**
   * cierra una alerta
   * @param {object} $scope - ng.IScope.
   * @param {number} index - posición de la alerta en el array de alertas.
   */
  public cerrar($scope,index): void{
    $scope.alerts.splice(index, 1);
  }

  /**
   * vacia todas las alertas
   * @param {object} $scope - ng.IScope.
   */
  public eliminar($scope): void{
    $scope.alerts = [];
    console.log($scope)
    $scope.$apply();
  }

  /**
   * procesa la salida de la alerta.
   * @param {string , object} msg - el mensaje de la alerta.
   * @return {object} msg - el mensaje de la alerta formateado.
   */
  public procesarAlerta(msg){
    var aMensajes = [];
    var self = this;
    if (angular.isObject(msg)){
      self.procesarAlertaObject(msg,aMensajes);
    }else if(angular.isString()){

      try{
        msg = JSON.parse(msg);
      }catch(e){}

      if (angular.isObject(msg)){
        self.procesarAlertaObject(msg,aMensajes);
      }else{
        self.procesarAlertaString(msg,aMensajes);
      }

    }
    return aMensajes;
  }

  public procesarAlertaObject(msg,aMensajes){
    for(var m in msg){
      try{ msg[m] = decodeURIComponent(escape(msg[m])); }catch(e){}
      aMensajes.push({titulo:m,texto:msg[m]});
    }
    return aMensajes;
  }

  public procesarAlertaString(msg,aMensajes){
    var p1 = msg.indexOf("<body>")+6;
    var p2 = msg.indexOf("</body>");
    aMensajes.push({
      titulo:'Error',
      texto:msg.substring(p1,p2)
    });
    return aMensajes;
  }

  }
