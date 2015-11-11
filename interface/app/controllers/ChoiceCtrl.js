/**
 * Created by vasa on 28.06.14.
 */

(function () {
  'use strict';

  const filterTags = ['controllers', 'enabled', 'events', 'fire', 'connection', 'door', 'common_alarm', 'lock', 'on_maintenance'];

  function _objectAcc(target, source, field) {
    target[field] = (source[field] || 0) + (target[field] || 0);
  }

  function _initFilters(rdp, accumulator) {
    filterTags.forEach((tag) => _objectAcc(accumulator, rdp, tag));
  }

  function initStatistics(allRdps, lightSystem) {
    const sum = {};
    const rdps = _(allRdps)
      .filter((rdp) => rdp.sid.startsWith(lightSystem))
      .each((rdp) => _initFilters(rdp, sum))
      .groupBy('slug')
      .value();
    return {rdps, sum};
  }

  function ChoiceCtrl($scope, $state, RDPs, Mutex, tickEvent) {

    const mutex = Mutex.create();

    const loadStatistics = function () {
      if (!mutex.isLocked()) {
        mutex.lock();

        $scope.currentDate = new Date();

        RDPs.query(function (rdps) {
          const {sum: sumNO, rdps: rdpsNO} = initStatistics(rdps, 'obekty-no');
          const {sum: sumAHP, rdps: rdpsAHP} = initStatistics(rdps, 'akhp');
          const {sum: sumGRS, rdps: rdpsGRS} = initStatistics(rdps, 'gruppovye-reguliator');

          $scope.sumNO = sumNO;
          $scope.sumAHP = sumAHP;
          $scope.sumGRS = sumGRS;

          $scope.rdps = rdpsNO;
          $scope.ahps = rdpsAHP;
          $scope.grs = rdpsGRS;

          mutex.release();
        });

        RDPs.query_groups(function (rdps) {
          $scope.rdpsGroup = rdps;
        });

      }
    };

    loadStatistics();

    $scope.$on(tickEvent, loadStatistics);

    $scope.show = {};

  }

  function integralTableRow() {
    return {
      replace: true,
      templateUrl: '/assets/templates/integral-row.html',
      scope: {
        rdp: '=integralTableRow',
        clickLink: '&',
        first: '@'
      }
    };
  }

  function integralAhpRow() {
    return {
      replace: true,
      templateUrl: '/assets/templates/integral-ahp-row.html',
      scope: {
        rdp: '=integralAhpRow',
        clickLink: '&',
        first: '@'
      }
    };
  }

  angular.module('asuno').controller('ChoiceCtrl', ChoiceCtrl);
  angular.module('asuno').directive('integralTableRow', integralTableRow);
  angular.module('asuno').directive('integralAhpRow', integralAhpRow);
})();
