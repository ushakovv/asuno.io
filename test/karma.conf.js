//jshint ignore:start
/* eslint-disable */

module.exports = function (config) {
  config.set({

    basePath : '..',

    frameworks : ['jasmine'],

    files : [
      'bower_components/es5-shim/es5-shim.js',
      'bower_components/lodash/dist/lodash.js',
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-socket-io/socket.js',
      'bower_components/ng-grid/ng-grid-2.0.13.debug.js',
      'bower_components/angular-strap/dist/angular-strap.js',
      'bower_components/angular-strap/dist/angular-strap.tpl.js',
      'bower_components/angular-bootstrap/ui-bootstrap.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/react/react-with-addons.js',
      'bower_components/react/JSXTransformer.js',
      'bower_components/eventEmitter/EventEmitter.js',

      'interface/vendor/Flux.js',

      'interface/app/app.js',
      'interface/app/components/ngInjectMixin.js',
      'interface/app/components/MaintenanceIcon.js',
      'interface/app/components/ControllerBlockAlarm.js',
      'interface/app/components/ControllerBlock.js',
      'interface/app/components/Controllers.js',
      'interface/app/components/Clock.js',
      'interface/app/controllers/**/*.js',
      'interface/app/directives/**/*.js',
      'interface/app/filters/**/*.js',
      'interface/app/i18n/**/*.js',
      'interface/app/services/**/*.js',
      'interface/templates/**/*.html',

      'test/unit/**/*.unit.js'
    ],

    exclude : [
    ],

    preprocessors : {
      'interface/templates/**/*.html' : ['ng-html2js'],
      'interface/app/**/*.js'         : ['coverage']
    },

    ngHtml2JsPreprocessor : {
      stripPrefix   : 'interface/app',
      prependPrefix : '/assets/templates',
      moduleName    : 'templates'
    },

    reporters : ['progress', 'coverage', 'osx'],

    port : 9876,

    colors : true,

    logLevel : config.LOG_INFO,

    autoWatch : true,

    browsers : ['Chrome'],

    singleRun : false
  });
};
