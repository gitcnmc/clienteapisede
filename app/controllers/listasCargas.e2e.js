browser.get('http://127.0.0.1/ngCargador/dist/');

describe('listas Cargas Controller', function() {


    element(by.css('#aListasCargas')).click();


    var consumerKey = element(by.model('credenciales.consumerKey'));
    var consumerSecret = element(by.model('credenciales.consumerSecret'));
    var nif = element(by.model('credenciales.nif'));
    

    

    it('NO debería listarse las descargas si las credenciales no son correctas',function(){
        consumerKey.clear();
        consumerSecret.clear();
        consumerKey.sendKeys("xxx");
        consumerSecret.sendKeys("xxx");
        element(by.css('#btnAceptarOauth')).click(); 

        var cargas = element.all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index'));

        expect(cargas.count()).toBe(0);
        expect(element(by.css(".grid")).isDisplayed()).toBeFalsy();
    });

   
    it('NO debería listarse las descargas si los parámetros de consultas son inccorectos',function(){
        consumerKey.clear();
        consumerSecret.clear();
        consumerKey.sendKeys("46807d93-3c14-426d-baff-60ff377911bd");
        consumerSecret.sendKeys("03cf5f4e-8741-4ee8-8490-310445418fa0");

        element(by.css('#btnAceptarOauth')).click();

        nif.clear();
        nif.sendKeys("XXX");

        element(by.css('#listar')).click();

        var cargas = element.all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index'));

        expect(cargas.count()).toBe(0);
        expect(element(by.css(".grid")).isDisplayed()).toBeFalsy();

    });


    it('debería listarse las descargas si las credenciales son correctas y los parámetros son correctos',function(){
        nif.clear();
        nif.sendKeys("11B");
        element(by.css('#listar')).click();

        var cargas = element.all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index'));

        expect(cargas.isDisplayed()).toBeTruthy();
        expect(element(by.css(".grid")).isDisplayed()).toBeTruthy();
    });


   

});