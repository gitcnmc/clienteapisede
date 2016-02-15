
var consumerKey_1 = "a62d4fc-9d08-451e-bbcf-55fffb444421";
var consumerSecret_1 = "047ab7cf-111a-4602-a06e-a6997599ce6d";

var consumerKey_2 = "46807d93-3c14-426d-baff-60ff377911bd";
var consumerSecret_2 = "03cf5f4e-8741-4ee8-8490-310445418fa0";

describe("Listas Cargas", function() {

  var scope;
  var controller;
  var consumidor;
  var entorno;
  var credenciales;
  var alerta;

  beforeEach(module('cargador'));

  beforeEach(inject(function ($rootScope, $controller, ConsumidorResource, AlertaResource,EntornoResource,CredencialesResource) {
      scope = $rootScope.$new();
      controller = $controller('listasCargasControl', {
          '$scope': scope
      });
      consumidor = ConsumidorResource;
      alerta = AlertaResource;
      credenciales = CredencialesResource;
      entorno = EntornoResource;
  }));


  describe("Consultar listas de cargas: ",function(){

    it("Debería procesar un error, si los parámetros de envío son incorrectos.", inject(function($httpBackend,$uibModal,$q){

      //insertamos las credenciales incorrectas
      credenciales.nif = "xxxx";
      credenciales.consumerKey = consumerKey_1;
      credenciales.consumerSecret = consumerSecret_1;
      scope.tableParamsListasCargas = {};


      //expect de la petición HTTP

      $httpBackend.expectPOST(new RegExp('https://apipre.cnmc.gob.es/carga/v1/listar_cargas.*')).respond(455,"");

      //ejecutar el método de la petición HTTP
      controller.listar_cargas();

      $httpBackend.flush();

      //esperar que la tabla no contenga datos
      expect(scope.gridOptions.data.length).toBe(0);

      //esperar que se muestre el error en alerta(factory)
      expect(scope.alerts.length).toBe(1);


    }));

    it("Debería listar las cargas, si los parámetros de envío son correctos.", inject(function($httpBackend,$uibModal,$q){

      //insertamos las credenciales incorrectas
      credenciales.nif = "11B";
      credenciales.consumerKey = consumerKey_2;
      credenciales.consumerSecret = consumerSecret_2;
      scope.tableParamsListasCargas = {};


      //expect de la petición HTTP
      var httpResponse = "";
      $httpBackend.expectPOST(new RegExp('https://apipre.cnmc.gob.es/carga/v1/listar_cargas.*')).respond(200, httpResponse);

      //ejecutar el método de la petición HTTP
      controller.listar_cargas();

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
