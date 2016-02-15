System.config({
  defaultJSExtensions: true,
  transpiler: "typescript",
  paths: {
    "npm:*": "jspm_packages/npm/*",
    "github:*": "jspm_packages/github/*",
    "bower:*": "jspm_packages/bower/*"
  },

  packages: {
    "app": {
      "main": "app",
      "defaultExtension": "ts"
    }
  },

  map: {
    "angular": "github:angular/bower-angular@1.4.9",
    "angular-bootstrap": "bower:angular-bootstrap@1.1.0",
    "angular-bootstrap-switch": "bower:angular-bootstrap-switch@0.4.1",
    "angular-i18n": "bower:angular-i18n@1.4.9",
    "angular-mocks": "github:angular/bower-angular-mocks@1.4.9",
    "angular-resource": "github:angular/bower-angular-resource@1.4.9",
    "angular-route": "github:angular/bower-angular-route@1.4.9",
    "angular-toggle-switch": "bower:angular-toggle-switch@1.3.0",
    "angular-ui-bootstrap": "bower:angular-ui-bootstrap@1.1.0",
    "angular-ui-grid": "github:angular-ui/bower-ui-grid@3.1.0",
    "angular-ui-switch2": "bower:angular-ui-switch2@0.1.0",
    "bootstrap": "github:twbs/bootstrap@3.3.6",
    "components-font-awesome": "bower:components-font-awesome@4.5.0",
    "jasmine": "npm:jasmine@2.4.1",
    "ng-table": "github:esvit/ng-table@0.8.3",
    "oauth-signature": "npm:oauth-signature@1.3.1",
    "typescript": "npm:typescript@1.7.5",
    "bower:angular-bootstrap-switch@0.4.1": {
      "angular": "bower:angular@1.4.9",
      "bootstrap": "bower:bootstrap@3.3.6",
      "bootstrap-switch": "bower:bootstrap-switch@3.3.2",
      "jquery": "bower:jquery@2.2.0"
    },
    "bower:angular-bootstrap@1.1.0": {
      "angular": "bower:angular@1.4.9"
    },
    "bower:angular-toggle-switch@1.3.0": {
      "css": "github:systemjs/plugin-css@0.1.20"
    },
    "bower:angular-ui-switch2@0.1.0": {
      "css": "github:systemjs/plugin-css@0.1.20"
    },
    "bower:bootstrap-switch@3.3.2": {
      "bootstrap": "bower:bootstrap@3.3.6",
      "css": "github:systemjs/plugin-css@0.1.20",
      "jquery": "bower:jquery@2.2.0"
    },
    "bower:bootstrap@3.3.6": {
      "jquery": "bower:jquery@2.2.0"
    },
    "bower:components-font-awesome@4.5.0": {
      "css": "github:systemjs/plugin-css@0.1.20"
    },
    "github:angular/bower-angular-mocks@1.4.9": {
      "angular": "github:angular/bower-angular@1.4.9"
    },
    "github:angular/bower-angular-resource@1.4.9": {
      "angular": "github:angular/bower-angular@1.4.9"
    },
    "github:angular/bower-angular-route@1.4.9": {
      "angular": "github:angular/bower-angular@1.4.9"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-http@1.7.1": {
      "Base64": "npm:Base64@0.2.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:twbs/bootstrap@3.3.6": {
      "jquery": "github:components/jquery@2.2.0"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.6",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:core-util-is@1.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:crypto-js@3.1.6": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:exit@0.1.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:glob@3.2.11": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "inherits": "npm:inherits@2.0.1",
      "minimatch": "npm:minimatch@0.3.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:jasmine-core@2.4.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:jasmine@2.4.1": {
      "exit": "npm:exit@0.1.2",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "glob": "npm:glob@3.2.11",
      "jasmine-core": "npm:jasmine-core@2.4.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:minimatch@0.3.0": {
      "lru-cache": "npm:lru-cache@2.7.3",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "sigmund": "npm:sigmund@1.0.1"
    },
    "npm:oauth-signature@1.3.1": {
      "crypto-js": "npm:crypto-js@3.1.6",
      "uri-js": "npm:uri-js@2.1.1"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:readable-stream@1.1.13": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:sigmund@1.0.1": {
      "http": "github:jspm/nodelibs-http@1.7.1",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.13"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:uri-js@2.1.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
