/**
 * Created by rus on 23.06.15.
 */
/**
 * Created by vasa on 18.08.14.
 */

(function () {
    'use strict';

    function DirectionLepCtrl($scope, $modal, $rootScope) {
        var dirLep = this;
        dirLep.isLinking = false;

        dirLep.showLep = function () {
            const $child = $scope.$new();

            $modal.open({
                templateUrl : '/assets/templates/modals/direction-lep-modal.html',
                scope : $child,
                controller: function ($rootScope, $scope, $timeout, Controllers, $modalInstance) {
                    let cable_ids = [];

                    function loadFilterCabels() {
                        Controllers.available_cables({id : $scope.controller.id}, (data) => cable_ids = data.cable_ids);
                    }

                    loadFilterCabels();
                    $scope.modalLepFilter = function (attributes) {
                        return cable_ids.indexOf(attributes.CABEL_ID) > -1;
                    };
                    $scope.chancel = function () {
                        $rootScope.resetDirectionId(true);
                        $modalInstance.dismiss();
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
                    dirLep.showLep(() => {
                        dirLep.isLinking = false;
                    });
                }
            }
        };
    }

    angular.module('asuno').controller('DirectionLepCtrl', DirectionLepCtrl);
})();
