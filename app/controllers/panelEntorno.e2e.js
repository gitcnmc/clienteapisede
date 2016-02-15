browser.get('http://127.0.0.1/ngCargador/dist/');

describe('panelEntorno Controller', function() {


    


    var consumerKey = element(by.model('credenciales.consumerKey'));
    var consumerSecret = element(by.model('credenciales.consumerSecret'));
    


    it('debería cambiar de vista al pulsar en culaquier enlace de operaciones',function(){


       element(by.linkText('Carga Express')).click();
        var content = element(by.css('[ng-view]')).getText();
        expect(content).toMatch(/Carga Express/);

        element(by.linkText('Listar Cargas')).click();
        var content = element(by.css('[ng-view]')).getText();
        expect(content).toMatch(/Listas Cargar/);

        element(by.linkText('Descargas')).click();
        var content = element(by.css('[ng-view]')).getText();
        expect(content).toMatch(/Descargas/);

    });


    it('debería quedarse habilitado el formulario si el modo de autorización es Oauth',function(){

        expect(element(by.css('#consumerKey')).getAttribute('disabled')).toBeFalsy();
        expect(element(by.css('#consumerSecret')).getAttribute('disabled')).toBeFalsy();
        expect(element(by.css('#recordar')).getAttribute('disabled')).toBeFalsy();
        expect(element(by.css('#btnAceptarOauth')).getAttribute('disabled')).toBeFalsy();
  
    });

    it('debería quedarse desabilitado el formulario si el modo de autorización es HTTPS',function(){

        element(by.css('#labelOption1')).click();
        expect(element(by.css('#consumerKey')).getAttribute('disabled')).toBeTruthy();
        expect(element(by.css('#consumerSecret')).getAttribute('disabled')).toBeTruthy();
        expect(element(by.css('#recordar')).getAttribute('disabled')).toBeTruthy();
        expect(element(by.css('#btnAceptarOauth')).getAttribute('disabled')).toBeTruthy();
        element(by.css('.btn-danger')).click();

  
    });

    it('debería mostrar una alerta si las credenciales oauth son incorrectas',function(){

        element(by.css('#labelOption2')).click();
        consumerKey.sendKeys("xxx");
        consumerSecret.sendKeys("xxx");
        element(by.css('#btnAceptarOauth')).click();  
        expect(element(by.css('#modal-body')).getText()).toMatch(/Compruebe sus credeciales Oauth/);
        element(by.css('.btn-danger')).click();

    });


    

    it('NO debería mostrar una alerta si las credenciales oauth son correctas',function(){

        consumerKey.clear();
        consumerSecret.clear();
        consumerKey.sendKeys("46807d93-3c14-426d-baff-60ff377911bd");
        consumerSecret.sendKeys("03cf5f4e-8741-4ee8-8490-310445418fa0");
        element(by.css('#btnAceptarOauth')).click();
        expect(element(by.css('#modal-body')).isDisplayed()).toBeTruthy();  
    });

    
   
    it('debería aparecer el dialogo de confirmación de redirección al pulsar el botón entorno',function(){
        
        element(by.css('#btnEntorno')).click();
        expect(element(by.css('#modal-body')).getText()).toMatch(/Le redirigimos a producción. ¿Desea continuar?/);
        element(by.css('.btn-danger')).click();

    });

  

});
