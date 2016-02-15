

var consumerKey_1 = "a62d4fc-9d08-451e-bbcf-55fffb444421";
var consumerSecret_1 = "047ab7cf-111a-4602-a06e-a6997599ce6d";

var consumerKey_2 = "46807d93-3c14-426d-baff-60ff377911bd";
var consumerSecret_2 = "03cf5f4e-8741-4ee8-8490-310445418fa0";

describe("Carga Express", function() {

  var scope;
  var controller;
  var consumidor;
  var entorno;
  var credenciales;
  var alerta;

  beforeEach(module('cargador'));

  beforeEach(inject(function ($rootScope, $controller, ConsumidorResource, AlertaResource, EntornoResource,CredencialesResource) {
      scope = $rootScope.$new();
      controller = $controller('cargaExpressControl', {
          '$scope': scope
      });
      consumidor = ConsumidorResource;
      alerta = AlertaResource;
      credenciales = CredencialesResource;
      entorno = EntornoResource;

      credenciales.nif = "11B";
      credenciales.nif_presentador = "11B";
      credenciales.consumerKey = consumerKey_2;
      credenciales.consumerSecret = consumerSecret_2;
      scope.alerts = [];
  }));



  describe("Cargar el fichero en una única operación: ",function(){

    it("Debería procesar un error, si los parámetros de envío son incorrectos.", inject(function($httpBackend,$uibModal,$q){

      //insertamos las credenciales incorrectas
      credenciales.nif = "xxxx";
      credenciales.consumerKey = consumerKey_1;
      credenciales.consumerSecret = consumerSecret_1;

      //expect de la petición HTTP
      $httpBackend.expectPOST(new RegExp('https://apipre.cnmc.gob.es/carga/v1/iniciar_carga/.*')).respond(455,"");

      //ejecutar el método de la petición HTTP
      var $file = {file:{}};
      controller.iniciarCarga($file,true);

      $httpBackend.flush();

      //esperar que se muestre el error en alerta(factory)
      expect(scope.alerts.length).toBe(1);


    }));

    it("Debería iniciar la carga, si los parámetros de envío son correctos.", inject(function($httpBackend,$uibModal,$q){


      //expect de la petición HTTP
      $httpBackend.expectPOST(new RegExp('https://apipre.cnmc.gob.es/carga/v1/iniciar_carga/.*')).respond(200,"");

      //ejecutar el método de la petición HTTP
      var $file = new File(["xxx"], "xxx");
      controller.iniciarCarga($file,true);

      $httpBackend.flush();

      expect(scope.alerts.length).toBe(0);

      var uuidCarga = ($file.hasOwnProperty('uuidCarga')) ? true : false;

      expect(uuidCarga).toBe(true);

    }));

    it("Debería subir el fichero completo, si se ha iniciado la carga.", inject(function($httpBackend,$uibModal,$q){

      //expect de la petición HTTP
      $httpBackend.expectPOST(new RegExp('https://apipre.cnmc.gob.es/carga/v1/subir_fichero_completo.*')).respond(200,"");

      //ejecutar el método de la petición HTTP
      var $file = {file:{uuidCarga:'374de50a-64c3-4519-8455-6582c868c4c2'}};
      controller.subirFicheroCompleto({uuidCarga:'374de50a-64c3-4519-8455-6582c868c4c2'},$file,true);

      $httpBackend.flush();

      expect(scope.alerts.length).toBe(0);

    }));

    it("Debería confirmar la carga, si se ha subido el fichero completo.", inject(function($httpBackend,$uibModal,$q){

      //expect de la petición HTTP
      $httpBackend.expectGET(new RegExp('https://apipre.cnmc.gob.es/carga/v1/confirmar_carga/.*')).respond(200,"");

      //ejecutar el método de la petición HTTP
      controller.confirmarCarga({uuidCarga:'374de50a-64c3-4519-8455-6582c868c4c2'});

      $httpBackend.flush();

      expect(scope.alerts.length).toBe(0);

    }));

  });

  describe("Cargar el fichero en múltiple fragmentos: ",function(){

    it("Debería procesar un error, si los parámetros de envío son incorrectos.", inject(function($httpBackend,$uibModal,$q){

      //insertamos las credenciales incorrectas
      credenciales.nif = "xxxx";
      credenciales.consumerKey = consumerKey_1;
      credenciales.consumerSecret = consumerSecret_1;

      //expect de la petición HTTP
      $httpBackend.expectPOST(new RegExp('https://apipre.cnmc.gob.es/carga/v1/iniciar_carga/.*')).respond(455,"");

      //ejecutar el método de la petición HTTP
      var $file = new File([],'');

      controller.iniciarCarga($file,true);

      $httpBackend.flush();

      //esperar que se muestre el error en alerta(factory)
      expect(scope.alerts.length).toBe(1);


    }));

    it("Debería iniciar la carga, si los parámetros de envío son correctos.", inject(function($httpBackend,$uibModal,$q){

      //expect de la petición HTTP
      $httpBackend.expectPOST(new RegExp('https://apipre.cnmc.gob.es/carga/v1/iniciar_carga/.*')).respond(200,"");

      var $file = new File(["xxx"], "xxx");

      controller.iniciarCarga($file,true);

      $httpBackend.flush();

      expect(scope.alerts.length).toBe(0);

      var uuidCarga = ($file.hasOwnProperty('uuidCarga')) ? true : false;

      expect(uuidCarga).toBe(true);

    }));

    it("Debería inicar la carga del fichero, si se ha iniciado la carga.", inject(function($httpBackend,$uibModal,$q){

      //expect de la petición HTTP
      $httpBackend.expectPOST(new RegExp('https://apipre.cnmc.gob.es/carga/v1/iniciar_subida_fichero.*')).respond(200,"");

      //ejecutar el método de la petición HTTP
      var $file = new File(["xxx"], "xxx");
      $file.partes = [];
      controller.iniciarCargaFichero($file,true);

      $httpBackend.flush();

      expect(scope.alerts.length).toBe(0);

      var uuidUpload = ($file.hasOwnProperty('uuidUpload')) ? true : false;

      expect(uuidUpload).toBe(true);

    }));

    it("Debería subir el chunk fichero completo, si se ha iniciado la carga del fichero.", inject(function($httpBackend,$uibModal,$q){


      //expect de la petición HTTP
      $httpBackend.expectPOST(new RegExp('https://apipre.cnmc.gob.es/carga/v1/subir_chunk_fichero.*')).respond(200,"");

      var $file = new File(["x"], "xxx");
      $file.partes = [
          {size:1, progressParar : false,iniciarCarga: false}
      ];

      //ejecutar el método de la petición HTTP

      controller.subirChunkFicheroCompleto($file,true);

      $httpBackend.flush();

      expect(scope.alerts.length).toBe(0);


    }));

    it("Debería confirmar el fichero, si se ha subido chunk fichero completo.", inject(function($httpBackend,$uibModal,$q){

      //expect de la petición HTTP
      $httpBackend.expectGET(new RegExp('https://apipre.cnmc.gob.es/carga/v1/confirmar_subida_fichero/.*')).respond(200,"");

      //ejecutar el método de la petición HTTP
      var $file = new File(["x"], "xxx");
      $file.uuidUpload = '';
      controller.confirmarSubidaFichero($file,true);

      $httpBackend.flush();

      expect(scope.alerts.length).toBe(0);

    }));

    it("Debería confirmar la carga, si se ha confirmado el fichero.", inject(function($httpBackend,$uibModal,$q){

      //expect de la petición HTTP
      $httpBackend.expectGET(new RegExp('https://apipre.cnmc.gob.es/carga/v1/confirmar_carga/.*')).respond(200,"");

      //ejecutar el método de la petición HTTP
      var $file = new File(["x"], "xxx");
      $file.uuidCarga = '';
      controller.confirmarCarga($file);

      $httpBackend.flush();

      expect(scope.alerts.length).toBe(0);

    }));


  })

});

window.test = true;
window.iniciarTest();
