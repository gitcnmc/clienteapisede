
var consumerKey_1 = "a62d4fc-9d08-451e-bbcf-55fffb444421";
var consumerSecret_1 = "047ab7cf-111a-4602-a06e-a6997599ce6d";

var consumerKey_2 = "46807d93-3c14-426d-baff-60ff377911bd";
var consumerSecret_2 = "03cf5f4e-8741-4ee8-8490-310445418fa0";

describe("Descargas", function() {

  var scope;
  var controller;
  var consumidor;
  var entorno;
  var credenciales;
  var alerta;

  beforeEach(module('cargador'));

  beforeEach(inject(function ($rootScope, $controller, ConsumidorResource, AlertaResource,EntornoResource,CredencialesResource) {
      scope = $rootScope.$new();
      controller = $controller('descargasControl', {
          '$scope': scope
      });
      consumidor = ConsumidorResource;
      alerta = AlertaResource;
      credenciales = CredencialesResource;
      entorno = EntornoResource;
  }));


  describe("consultar descargas",function(){

    it("Debería procesar un error, si el usuari no tiene permisos para ver las descargas.", inject(function($httpBackend,$uibModal,$q){

      //insertamos las credenciales incorrectas
      credenciales.nif = "A80607112";
      credenciales.consumerKey = consumerKey_1;
      credenciales.consumerSecret = consumerSecret_1;
      scope.tableParamsDescargas = {};


      //expect de la petición HTTP
      //var httpResponse = "<html><head><title>Error</title></head><body>El usuario no tiene el permiso necesario DESCARGA</body></html>";
      $httpBackend.expectPOST(new RegExp('https://apipre.cnmc.gob.es/ficheros/v1/consultar.*')).respond(403,'');

      //ejecutar el método de la petición HTTP
      controller.listarDescargas();

      $httpBackend.flush();

      //esperar que la tabla no contenga datos
      expect(scope.gridOptions.data.length).toBe(0);

      //esperar que se muestre el error en alerta(factory)
      expect(scope.alerts.length).toBe(1);


    }));

    it("Debería procesar el error, si el nif de la empresa es incorrecto.", inject(function($httpBackend,$uibModal,$q){

      //insertamos las credenciales incorrectas
      credenciales.nif = "xxx";
      credenciales.consumerKey = consumerKey_2;
      credenciales.consumerSecret = consumerSecret_2;
      scope.tableParamsDescargas = {};


      //expect de la petición HTTP
      //var httpResponse = "<html><head><title>Error</title></head><body>El usuario no tiene el permiso necesario DESCARGA</body></html>";
      $httpBackend.expectPOST(new RegExp('https://apipre.cnmc.gob.es/ficheros/v1/consultar.*')).respond(403,'');

      //ejecutar el método de la petición HTTP
      controller.listarDescargas();

      $httpBackend.flush();

      //esperar que la tabla no contenga datos
      expect(scope.gridOptions.data.length).toBe(0);

      //esperar que se muestre el error en alerta(factory)
      expect(scope.alerts.length).toBe(1);


    }));

    it("Debería listar las descargas, si el usuario tiene permisos.", inject(function($httpBackend,$uibModal,$q){

      //insertamos las credenciales incorrectas
      credenciales.nif = "11B";
      credenciales.consumerKey = consumerKey_2;
      credenciales.consumerSecret = consumerSecret_2;
      scope.tableParamsDescargas = {};


      //expect de la petición HTTP
      var httpResponse = "";
      $httpBackend.expectPOST(new RegExp('https://apipre.cnmc.gob.es/ficheros/v1/consultar.*')).respond(200, httpResponse);

      //ejecutar el método de la petición HTTP
      controller.listarDescargas();

      $httpBackend.flush();

      //esperar que la tabla no contenga datos
      expect(scope.gridOptions.hasOwnProperty("data")).toBe(true);

      //esperar que se muestre el error en alerta(factory)
      expect(scope.alerts.length).toBe(0);

    }));
  });

});

window.test = true;
window.iniciarTest();
