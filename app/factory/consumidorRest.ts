import * as shapes from "../app";

/*** Class ConsumidorRestFactory ***/
export class ConsumidorRestFactory{

  $resource;
  $http;
  $timeout;
  $q;
  pendingRequests;
  credenciales;
  entorno;
  /**
   * Crea la factory ConsumidorRestFactory.
   * @param {object} $resource - ng.IResourceService
   * @param {object} $http - ng.IHttpService
   * @param {object} $timeout - ng.ITimeoutService
   * @param {object} $q - ng.IQService
   * @param {object} PendingRequestsResource
   * @param {object} CredencialesResource
   * @param {object} EntornoResource
   */
  static $inject = ['$resource','$http','$timeout','$q','PendingRequestsResource','CredencialesResource','EntornoResource'];
  constructor($resource,$http,$timeout,$q,PendingRequestsResource,CredencialesResource,EntornoResource){
    this.$resource = $resource;
    this.$http = $http;
    this.$timeout = $timeout;
    this.$q = $q;
    this.pendingRequests = PendingRequestsResource;
    this.credenciales = CredencialesResource;
    this.entorno = EntornoResource;
  }

  public nif(){
    var self = this;
    var url = shapes.firmarPeticion(self.entorno.autorizacion,self.entorno.conseguir_url()+'test/v1/nif',self.credenciales.consumerKey,self.credenciales.consumerSecret);
    return self.$resource(url);
  }

  public listarProcedimientos(param){
    var self = this;
    var url = shapes.firmarPeticion(self.entorno.autorizacion,self.entorno.conseguir_url()+'catalogo/v1/procedimientos',self.credenciales.consumerKey,self.credenciales.consumerSecret,"GET");
    return self.$http.get(url);
  };

  public listarTipoFicheros(idProcedimiento){
    var self = this;
    var url = shapes.firmarPeticion(self.entorno.autorizacion,self.entorno.conseguir_url() + 'catalogo/v1/tipo_ficheros/' + idProcedimiento + '?entrada=true', self.credenciales.consumerKey, self.credenciales .consumerSecret, "GET", {'entrada':true});
    return self.$http.get(url);
  }

  public listarCargas(param) {
    var self = this;
    var url = shapes.firmarPeticion(self.entorno.autorizacion,self.entorno.conseguir_url()+'carga/v1/listar_cargas',self.credenciales.consumerKey,self.credenciales.consumerSecret,"POST");
    return self.$http.post(url, {
      nifEmpresa:param.nifEmpresa,
      idProcedimiento:param.idProcedimiento,
      estado:param.estado,
      nifPresentador:param.nifPresentador
    });
  };

  public consultarEstadoCarga(param){
    var self = this;
    param.uuidCarga = encodeURIComponent(param.uuidCarga);
    var url = shapes.firmarPeticion(self.entorno.autorizacion,self.entorno.conseguir_url()+'carga/v1/consultar_estado_carga/'+param.uuidCarga,self.credenciales.consumerKey,self.credenciales.consumerSecret,"GET");
    return self.$resource(url).get();
  }

  public listarDescargas(param){
    var self = this;
    var url = self.entorno.conseguir_url()+'ficheros/v1/consultar';
    url += "?idProcedimiento="+param.idProcedimiento;
    url += "&nifEmpresa="+param.nifEmpresa;
    url += "&estado="+param.estado;
    url = shapes.firmarPeticion(self.entorno.autorizacion,url,self.credenciales.consumerKey,self.credenciales.consumerSecret,"POST",param);
    return self.$http.post(url);
  }

  public iniciarCarga(param){
    var self = this;
    var parametrosPost = {
      nifEmpresa:param.nifEmpresa,
      idProcedimiento:param.idProcedimiento,
      nifPresentador:param.nifPresentador,
      fechaEfecto : null
    }
    if(param.hasOwnProperty('fechaEfecto')){
      param.fechaEfecto.setHours(1);
      parametrosPost.fechaEfecto = param.fechaEfecto.toISOString().substring(0,10);
    }else{
      delete parametrosPost.fechaEfecto;
    }
    var url = shapes.firmarPeticion(self.entorno.autorizacion,self.entorno.conseguir_url()+'carga/v1/iniciar_carga/',self.credenciales.consumerKey,self.credenciales.consumerSecret,"POST");
    return self.$http.post(url,parametrosPost);
  }

  public iniciarCargaFichero(param){
    var self = this;
    var url = shapes.firmarPeticion(self.entorno.autorizacion,self.entorno.conseguir_url()+'carga/v1/iniciar_subida_fichero/',self.credenciales.consumerKey,self.credenciales.consumerSecret,"POST");
    return self.$http.post(url, {
      uuidCarga: param.uuidCarga,
      tipoFichero: param.tipoFichero,
      nombreFichero: param.name,
      numeroBytes: param.size
    });
  }



  public cancelarCarga(param){
    var self = this;
    param.uuidCarga = encodeURIComponent(param.uuidCarga);
    var url = shapes.firmarPeticion(self.entorno.autorizacion,self.entorno.conseguir_url()+'carga/v1/cancelar_carga/'+param.uuidCarga,self.credenciales.consumerKey,self.credenciales.consumerSecret,"GET");
    return self.$resource(url).get();

  }

  public subirFicheroCompleto(param,$file){
    var self = this;
    var deferred = self.$q.defer();
    var url = self.entorno.conseguir_url()+'carga/v1/subir_fichero_completo';
    url += "?uuidCarga="+param.uuidCarga;
    url += "&tipoFichero="+param.tipoFichero;
    url += "&nombreFichero="+param.nombreFichero;
    url += "&numeroBytes="+param.numeroBytes;
    url = shapes.firmarPeticion(self.entorno.autorizacion,url,self.credenciales.consumerKey,self.credenciales.consumerSecret,"POST",param);
    self.pendingRequests.add({
      url: url,
      canceller: deferred
    });
    var fd = new FormData();
    fd.append('file', $file);
    var respuesta = self.$http.post(url, fd, {
        timeout: deferred.promise,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined,
          __XHR__: function() {
              return function(xhr) {
                  xhr.upload.addEventListener("progress", function(event) {
                    var progress = ((event.loaded/event.total) * 100);
                    self.$timeout(function(){
                      self.notificarProgreso($file,progress);
                    },1);
                  });
              };
          }
        }
      });

      respuesta
        .success(function(data){
          self.pendingRequests.remove(url);
          deferred.resolve(data);
          //console.log(data);
          //confirmarCarga(data,file.uuidCarga,$flowFile);
        })
        .error(function(error){
          self.pendingRequests.remove(url);
          deferred.reject();
          //console.log(error);
          //alerta.anadir($scope,error);
        })
        .finally(function() {
            self.pendingRequests.remove(url);
        });

    return deferred.promise;

  }

  public confirmarCarga(param){
    var self = this;
    param.uuidCarga = encodeURIComponent(param.uuidCarga);
    var url = shapes.firmarPeticion(self.entorno.autorizacion,self.entorno.conseguir_url()+'carga/v1/confirmar_carga/'+param.uuidCarga,self.credenciales.consumerKey,self.credenciales.consumerSecret,"GET");
    return self.$resource(url).get();
  }

  public confirmarSubidaFichero(param){
    var self = this;
    param.uuidUpload = encodeURIComponent(param.uuidUpload);
    var url = shapes.firmarPeticion(self.entorno.autorizacion,self.entorno.conseguir_url()+'carga/v1/confirmar_subida_fichero/'+param.uuidUpload,self.credenciales.consumerKey,self.credenciales.consumerSecret,"GET");
    return self.$resource(url).get();
  }

  public subirChunkFichero(param,file,$flowFile,$flowFile_padre){
    var self = this;
    var deferred = self.$q.defer();
    $flowFile_padre = $flowFile_padre || null;
    var url = self.entorno.conseguir_url()+'carga/v1/subir_chunk_fichero/'+param.uuidUpload;
    delete param.uuidUpload;
    url += "?numeroParte="+param.numeroParte;
    url += "&tamanoParte="+param.tamanoParte;
    url = shapes.firmarPeticion(self.entorno.autorizacion,url,self.credenciales.consumerKey,self.credenciales.consumerSecret,"POST",param);
    self.pendingRequests.add({
      url: url,
      canceller: deferred
    });
    var fd = new FormData();
    fd.append('file', file);
    var respuesta = self.$http.post(url, fd, {
        timeout: deferred.promise,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined,
          __XHR__: function() {
              return function(xhr) {
                  xhr.upload.addEventListener("progress", function(event) {
                    var progress = ((event.loaded/event.total) * 100);
                    self.$timeout(function(){
                      self.notificarProgreso($flowFile,progress);
                    },1);
                  });
              };
          }
        }
      });

      respuesta
        .success(function(data){
          self.pendingRequests.remove(url);
          if($flowFile_padre != null){
            var progress = ($flowFile.size * 100) / $flowFile_padre.size;
            self.notificarProgreso($flowFile_padre,progress,true);
          }
          deferred.resolve(data);
          //console.log(data);
          //confirmarCarga(data,file.uuidCarga,$flowFile);
        })
        .error(function(error){
          self.pendingRequests.remove(url);
          deferred.reject();
          //console.log(error);
          //alerta.anadir($scope,error);
        })
        .finally(function() {
            self.pendingRequests.remove(url);
        });

    return deferred.promise;

  }



  public notificarProgreso($flowFile,progress,anadir = false): void{
      anadir = anadir || false;
      if(!$flowFile.progressParar){
        if(anadir){
          $flowFile.progress += progress;
        }else{
          $flowFile.progress = progress;
        }

      }
  }


}
