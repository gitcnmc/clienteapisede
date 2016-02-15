
/** Class Fragmentos. */
export class ClickDetail {

    $filter;
    $compile;
    $http;
    $templateCache;
    static $inject = ['$filter','$compile','$http','$templateCache'];
    constructor($filter,$compile,$http,$templateCache) {
      this.$filter = $filter;
      this.$compile = $compile;
      this.$http = $http;
      this.$templateCache = $templateCache;
    }

    compile = function(tElement, tAttrs) {
      var self = this;
      var templateHtml = "";
      var templateLoader = self.$http.get("./templates/clickDetail.html ", {cache: self.$templateCache})
        .success(function(html) {
          templateHtml = html;
        });

      return function (scope, element, attrs) {
        templateLoader.then(function (templateText) {
          element.parent().parent()
          .after(self.$compile(templateHtml)(scope));
        });
      };
    }


    scope = true;  // use a child scope that inherits from parent
    restrict = 'AE';
    link = (scope, element, attrs) => {
      var self = this;
      console.log(scope);
    }

    static factory() {
       //Create factory function which when invoked with dependencies by
       //angular will return newed up instance passing the timeout argument
        var directive =
              ($filter,$compile,$http,$templateCache) => new ClickDetail($filter,$compile,$http,$templateCache);
        //directive's injection list
        directive.$inject = ['$filter','$compile','$http','$templateCache'];
        return directive;
    }
}
