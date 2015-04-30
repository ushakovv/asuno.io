(function() {
  'use strict';

  angular.module('asuno')
    .directive('controllerDescription', function controllerDescription() {
      return {
        replace: true,
        templateUrl: '/assets/templates/controller-description.tmpl.html',
        scope: {
          controller: '=controllerDescription'
        },
        bindToController: true,
        controller: 'ControllerDescriptionController as cd',
        link: function(scope, element) {
          scope.focusInput = function() {
            element.find('textarea').focus();
          };
        }
      };
    })
    .controller('ControllerDescriptionController', function ControllerDescriptionController($scope, Controllers) {
      const cd = this;

      this._newDescription = this.controller.description;

      this.editDescription = function() {
        cd._showEditor = true;
        $scope.focusInput();
      };

      this.closeEditor = function() {
        cd._showEditor = false;
        cd._newDescription = cd.controller.description;
      };

      this.cleanDescription = function() {
        Controllers.patch({id: cd.controller.id}, {description: ''}, function() {
          cd.controller.description = '';
          cd.closeEditor();
        });
      };

      this.saveDescription = function(description) {
        Controllers.patch({id: cd.controller.id}, {description: description}, function() {
          cd.controller.description = description;
          cd.closeEditor();
        });
      };
    });
})();
