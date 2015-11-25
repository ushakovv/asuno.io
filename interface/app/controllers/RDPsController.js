/**
 * Created by vasa on 26.03.14.
 */

(function () {
  'use strict';

  function RDPsController($scope, $state, $log, RDPs, FilterSvc, Mutex, FILTER_CONFIGS, tickEvent, Controllers, $rootScope) {
    var mutex = Mutex.create();

    $scope.alertsGridOptions.columnDefs[2].visible = true;
    $rootScope.isLoadingPage = false;

    $scope.crumbs = [
      {name : 'Объекты НО'}
    ];

    $scope.child = $scope.$new();

    const _dateBegin = moment();
    const _defaultDateFrom = _dateBegin.add(-7, 'd').toDate();

    $scope.filters = {
      dateFrom: _defaultDateFrom
    };

    var setFilters = function () {
      FilterSvc.clear();
      $scope.rdps.forEach(FilterSvc.parseRDP, FilterSvc);
    };

    setFilters();

    $log.debug('RDPsController', Controllers.all_cables);
    let cabels = [];

    Controllers.all_cables({}).$promise
        .then((data) => {
      cabels = data.cables;
  });

  $scope.lepFilter = function (attributes) {
    $log.debug('lepFilter', attributes, $scope.cabels);
    return cabels.indexOf(attributes.CABEL_ID) > 0;
  };


  var calculate = function () {
      if (!mutex.isLocked()) {
        mutex.lock();
        RDPs.query_no(function (rdps) {
          $scope.rdps = rdps;
          if ($scope.filters.rdp) {
            $scope.filters.rdp = _.find(rdps, function (rdp) {
              return rdp.slug === $scope.filters.rdp.slug;
            });
          }
          setFilters();
          mutex.release();
        });
      }
    };

    $scope.$on(tickEvent, calculate);
    $scope.$on('asuno-refresh-all', calculate);

    $scope.selectRdp = function (rdp, graphic) {
      if (graphic) {
        $state.go('core.rdp', {
          rdp : rdp.slug,
          x   : graphic.geometry.x,
          y   : graphic.geometry.y,
          rid : graphic.attributes.DISPATCHER_ID
        });
      } else {
        $state.go('core.rdp', {rdp : rdp.slug});
      }
    };

    $scope.filterRdp = function (rdp) {
      return !!rdp[FILTER_CONFIGS[$scope.currentFilter()] || 'id'];
    };

    $scope.pointConnect = function (attributes) {
      return _.find($scope.rdps, function (rdp) {
        return rdp.gis_id === attributes.DISPATCHER_ID;
      });
    };

    $scope.rdpExtract = function (graphic) {
      var point = $scope.pointConnect(graphic.attributes);

      if (!point) {
        return void 0;
      }

      if (point.fire || point.door || point.connection || point.common_alarm || point.lock) {
        return -1;
      } else if (point.enabled > 0) {
        return 0;
      } else {
        return 1;
      }
    };

    $scope.filterToday = function () {
      if (!$scope.filters.filterToday) {
        $scope.filters.filterToday = true;
        var today = moment().startOf('day').toDate();
        var tomorrow = moment().add(1, 'd').startOf('day').toDate();

        angular.extend($scope.filters, {
          dateFrom : today,
          dateTo   : tomorrow
        });
      } else {
        delete $scope.filters.filterToday;

        angular.extend($scope.filters, {
          dateFrom: _defaultDateFrom,
          dateTo: null
        });
      }
    };

    $scope.filterAlarms = function () {
      if ($scope.filters.alarms === 1) {
        delete $scope.filters.alarms;
      } else {
        $scope.filters.alarms = 1;
      }
    };

    $scope.filterUnacknowledged = function () {
      if ($scope.filters.unacknowledged === 1) {
        delete $scope.filters.unacknowledged;
        delete $scope.filters.alarms;
      } else {
        $scope.filters.unacknowledged = 1;
        $scope.filters.alarms = 1;
      }
    };

    $scope.$watch('filters', function (next) {
      next = next || {};
      $scope.load_alarms({
        sid            : next.rdp ? next.rdp.sid : 'obekty-no',
        after          : next.dateFrom,
        before         : next.dateTo,
        alarms         : next.alarms,
        unacknowledged : next.unacknowledged
      });
    }, true);
  }

  angular.module('asuno').controller('RDPsController', RDPsController);
})();
