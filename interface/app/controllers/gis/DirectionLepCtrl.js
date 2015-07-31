/**
 * Created by rus on 23.06.15.
 */
/**
 * Created by vasa on 18.08.14.
 */

(function () {
    'use strict';

    function DirectionLepCtrl($scope, $modal, $rootScope, $log) {
        var dirLep = this;
        dirLep.isLinking = false;

        dirLep.showLep = function () {
            const $child = $scope.$new();

            $log.debug('showLep');
            $modal.open({
                templateUrl : '/assets/templates/modals/direction-lep-modal.html',
                scope : $child,
                controller: function ($rootScope, $scope, $timeout, Controllers) {
                    let cable_ids = [];

                    function loadFilterCabels() {
                        Controllers.available_cables({id : $scope.controller.id}, (data) => cable_ids = data.cable_ids);
                    }

                    loadFilterCabels();
                    $scope.modalLepFilter = function (attributes) {
                        return cable_ids.indexOf(attributes.CABEL_ID) > -1;
                    };
                }
            });
        };
        dirLep.linkDirection = function(cabelId, closeModal) {
            dirLep.isLinking = true;
            closeModal();
            $rootScope.linkDirection( cabelId, () => {
                dirLep.isLinking = false;
            } );
        };
        dirLep.toggleDirectionLink = function(cabelId, directionId) {
            $log.debug('toggleDirectionLink', dirLep.isLinking);
            if (!dirLep.isLinking) {
                dirLep.isLinking = true;
                if ( cabelId ) {
                    $rootScope.unlinkDirection( directionId, () => {
                        dirLep.isLinking = false;
                    });
                } else {
                    $rootScope.setDirectionId(directionId, () => {
                        dirLep.isLinking = false;
                    });
                    dirLep.showLep();
                }
            }
        };
    }

    angular.module('asuno').controller('DirectionLepCtrl', DirectionLepCtrl);
})();
