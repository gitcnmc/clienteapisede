

/** Class ClickDetail. */
export class BtnAnadirCarga {

    $parse;
    static $inject = ['$parse'];
    constructor($parse) {
      this.$parse = $parse;
    }
    
    scope = true;
    link = (scope, element, attrs) => {
        var self = this;
        element.bind('click', function () {
            document.getElementById('inputFile').click();
        });

        element.find("input").bind("change",function(e){
          var expressionHandler = self.$parse(attrs.btnAnadirCarga);
          for(var i = 0; i<e.target.files.length;i++){
            expressionHandler(scope, {file:e.target.files[i]});
          }

        });
    }


    static factory() {
        var directive = ($parse) => new BtnAnadirCarga($parse);
        directive.$inject = ["$parse"];
        return directive;
    }
}
