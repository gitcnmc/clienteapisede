
var consumerKey_1 = "a62d4fc-9d08-451e-bbcf-55fffb444421";
var consumerSecret_1 = "047ab7cf-111a-4602-a06e-a6997599ce6d";

var consumerKey_2 = "46807d93-3c14-426d-baff-60ff377911bd";
var consumerSecret_2 = "03cf5f4e-8741-4ee8-8490-310445418fa0";

describe("Oauth / HTTPS", function() {
  var scope;
  var controller;
  var consumidor;
  var entorno;
  var credenciales;
  var oauth;

  beforeEach(module('cargador'));

  beforeEach(inject(function ($rootScope, $controller, ConsumidorResource,EntornoResource,CredencialesResource,OauthResource) {
      scope = $rootScope.$new();
      controller = $controller('panelEntornoControl', {
          '$scope': scope
      });
      consumidor = ConsumidorResource;
      entorno = EntornoResource;
      credenciales = CredencialesResource;
      oauth = OauthResource;
  }));

  describe("Verificar nif: ",function(){

    it("Debería rellenarse la variable nif, si las credenciales son correctas.", inject(function($httpBackend,$uibModal,$q){

      //insertamos las credenciales correctas
      credenciales.nif = "";
      credenciales.consumerKey = consumerKey_1;
      credenciales.consumerSecret = consumerSecret_1;

      //expect de la petición HTTP
      var httpResponse = {"nif":"A80607112","empresa":["A80607112"]};
      $httpBackend.expectGET(new RegExp('https://apipre.cnmc.gob.es/test/v1/nif.*')).respond(200, httpResponse);

      //ejecutar el método de la petición HTTP
      oauth.validarCredenciales();

      $httpBackend.flush();

      expect(credenciales.nif).toBe("A80607112");


    }));

    it("Debería procesar un error, si las credenciales son incorrectas.", inject(function($httpBackend,$uibModal,$q){

      //insertamos las credenciales incorrectas
      credenciales.nif = "";
      credenciales.consumerKey = "xxx";
      credenciales.consumerSecret = "xxx";

      $httpBackend.expectGET(new RegExp('https://apipre.cnmc.gob.es/test/v1/nif.*')).respond(403, '');

      //ejecutar el método de la petición HTTP
      oauth.validarCredenciales();

      $httpBackend.flush();

      expect(credenciales.nif).toBe("");

    }));

  });


  describe("consumer Key & consumer Secret: ", function() {

    it("Deberían rellenarse las credenciales, si recordamos las credenciales.",inject(function($rootScope){

      credenciales.recordarCredenciales();
      var test = false;
      if (localStorage.getItem('preproduccion_consumerKey') != null && localStorage.getItem('preproduccion_consumerSecret') != null){
        if(credenciales.consumerKey > "" && credenciales.consumerSecret > ""){
          test = true;
        }
      }else{
        test = true;
      }

      expect(test).toBe(true);

    }));

    it("Deberían guardarse las credenciales en localStorage si guardamos las credenciales.", inject(function($rootScope){
      //se limpia localStorage para asegurar que la prueba se realiza bien.
      localStorage.removeItem("preproduccion_consumerKey");
      localStorage.removeItem("preproduccion_consumerSecret");
      credenciales.consumerKey = consumerKey_1;
      credenciales.consumerSecret = consumerSecret_1;
      credenciales.recordar = true;
      credenciales.guardarCredenciales();

      var test = (localStorage.getItem('preproduccion_consumerKey') > "" && localStorage.getItem('preproduccion_consumerSecret') > "");

      expect(test).toBe(true);

    }));

    it("Deberían de borrarse las credenciales de localStorage, si no queremos recordarlas.", inject(function($rootScope){
      //se limpia localStorage para asegurar que la prueba se realiza bien.

      credenciales.consumerKey = consumerKey_1;
      credenciales.consumerSecret = consumerSecret_1;
      credenciales.recordar = false;
      credenciales.guardarCredenciales();
      var test = (localStorage.getItem('consumerKey') > "" && localStorage.getItem('consumerSecret') > "");

      expect(test).toBe(false);

    }));

    });

});

window.test = true;
window.iniciarTest();
