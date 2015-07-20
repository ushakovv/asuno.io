/**
 * Created by vasa on 29.03.14.
 */

(function () {
  'use strict';

  function ControllerCtrl($rootScope, $scope, Scheme, $state, $q, $modal, $log, $timeout, $interval, controller, rdp, Controllers, ControllersActions, ReportFormatter, ControllerFactory, Sensors, Monitors, ClockStore, TimelineService, Mutex, tickEvent) {
    var mutex = Mutex.create();

    $scope.main.globalLocked = false;

    $scope.alertsGridOptions.columnDefs[2].visible = false;

    $scope.controller = controller;

    $scope.showDirectionsInfo = false;
    $timeout(() => $scope.showDirectionsInfo = true, 500);

    // TODO убрать нафиг когда Лёха поправит сервер
    $rootScope._rdpId = rdp.id;
    $scope.rdp = rdp;

    const _dateBegin = moment();
    const _defaultDateFrom = _dateBegin.add(-7, 'd').startOf('d').toDate();

    $scope.filters = {
      dateFrom: _defaultDateFrom
    };

    $log.debug('ControllerCtrl');

    ControllersActions.setControllers([$scope.controller]);
    ControllersActions.selectController($scope.controller.id);


    if (rdp.slug.indexOf('akhp') >= 0) {
      $scope.crumbs = [{
        name: 'Объекты АХП'
      }];
      $log.debug('Объекты АХП');
    } else if (rdp.slug === 'kulon') {
      $scope.crumbs = [{
        name: 'Групповые регуляторы'
      }];
    } else {
      $scope.crumbs = [
        {
          name: 'Объекты НО',
          href: $state.href('core.rdps')
        }
      ];
    }
    $scope.crumbs = $scope.crumbs.concat([
      {
        name: $scope.rdp.name,
        href: $state.href('core.rdp', {
          rdp: $scope.rdp.slug
        })
      },
      {
        name: $scope.controller.name
      }
    ]);

    let timeline;
    let pastTimeline;
    let begin, end;
    let _initialController = {};

    function _applyEvents(ticked) {
      var events = _(ticked)
              .filter((evt) => evt.__type__ === 'monitor')
    .takeRight(6)
          .sortBy((evt) => -evt.timestamp)
    .map((evt) => ReportFormatter.format_alarm_tl(evt, $scope.controller, $scope.rdp))
    .value();

      if (events.length === 6) {
        $scope.alarms = events;
      } else {
        $scope.alarms = _(events.concat($scope.alarms)).take(6);
      }
    }

    function _applyTick(ticked) {
      function _findMonitors(controller, id) {
        let monitors = _.filter($scope.controller.monitors, (m) => m.id === id);
        monitors = monitors.concat(_.filter($scope.controller.alarms.connection, (m) => m.id === id));
        monitors = monitors.concat(_.filter($scope.controller.alarms.fire, (m) => m.id === id));
        monitors = monitors.concat(_.filter($scope.controller.alarms.door, (m) => m.id === id));
        monitors = monitors.concat(_.filter($scope.controller.alarms.common_alarm, (m) => m.id === id));
        monitors = monitors.concat(_.filter($scope.controller.alarms.lock, (m) => m.id === id));

        return monitors;
      }

      if (ticked.length) {
        ticked.forEach(function (item) {
          switch (item.__type__) {
            case 'sensors':
              let sensor = _.find($scope.controller.sensors, (s) => s.id === item.sensor_id);
              if (!sensor) {
                sensor = _.find($scope.controller.other_sensors, (s) => s.id === item.sensor_id);
              }

              if (!sensor) {
                $log.debug('UNKNOWS SENSOR', item);
                break;
              }

              sensor.current_reading = item.value;
              sensor.last_reading_timestamp = item.timestamp;
              break;
            case 'monitor':
              let monitors = _findMonitors($scope.controller, item.monitor.id);

              if (!monitors.length) {
                $log.debug('UNKNOWS MONITOR', item);
                break;
              }

              monitors.forEach(function (monitor) {
                monitor.payload = item.state.payload;
                monitor.value = item.state.value;
                monitor.denotation = item.state.denotation;
                monitor.last_reading_timestamp = item.timestamp;
                monitor.silent = item.silent;
                monitor.silenced_by = item.silenced_by;
              });
              break;
            default:
              $log.debug('UNKNOWN ITEM TYPE', item);
          }
        });

        _applyEvents(ticked);

        $scope.controller.sensors = $scope.controller.sensors.slice();
        $scope.controller.other_sensors = $scope.controller.other_sensors.slice();
        $scope.controller.monitors = $scope.controller.monitors.slice();
        $scope.controller.alarms.fire = $scope.controller.alarms.fire.slice();
        $scope.controller.alarms.common_alarm = $scope.controller.alarms.common_alarm.slice();
        $scope.controller.alarms.door = $scope.controller.alarms.door.slice();
        $scope.controller.alarms.connection = $scope.controller.alarms.connection.slice();
        $scope.controller.alarms.lock = $scope.controller.alarms.lock.slice();
      }
    }

    function _applyInitialState(begin) {
      const pastMonitors = _.filter(pastTimeline, (item) => item.__type__ === 'monitor');
      const pastSensors = _.filter(pastTimeline, (item) => item.__type__ === 'sensors');

      _($scope.controller.monitors
              .concat($scope.controller.alarms.fire)
              .concat($scope.controller.alarms.door)
              .concat($scope.controller.alarms.common_alarm)
              .concat($scope.controller.alarms.connection)
              .concat($scope.controller.alarms.lock)
      ).filter((m) => new Date(m.last_reading_timestamp) >= begin)
      .filter((m) => !_.any(pastMonitors, (item) => item.monitor.id === m.id))
      .forEach(function (monitor) {
        monitor.payload = '';
        monitor.value = null;
        monitor.denotation = '';
        monitor.last_reading_timestamp = new Date(0);
      }).value();

      _($scope.controller.sensors.concat($scope.controller.other_sensors))
        .filter((s) => new Date(s.last_reading_timestamp) >= begin)
        .filter((s) => !_.any(pastSensors, (item) => item.sensor_id === s.id))
        .forEach((sensor) => {
            sensor.current_reading = null;
          sensor.last_reading_timestamp = "1970-01-01T00:00:00+00:00";
        }).value();
    }

    const _powerData = {
      maxAllowedPower : {
        value: 0,
        isError: true,
        errorMsg: 'Ошибка при получении максимально допустимого значения.'
      },
      avgPower : {
        value: 0,
        isError: true,
        errorMsg: 'Ошибка при получении среднего значения мощности.'
      }
    };

    Controllers.max_allowed_power({id: $scope.controller.id }).$promise
          .then((data) => {
        _powerData.maxAllowedPower.value = data.value;
      _powerData.maxAllowedPower.isError = false;
    });


    Controllers.avg_power({id: $scope.controller.id }).$promise
        .then((data) => {
      _powerData.avgPower.value = data.value;
    _powerData.avgPower.isError = false;
    });


    $rootScope.getPowerValues = function () {
      return _powerData;
    };

    $rootScope.changeSensors = function () {
      const params = {id: $scope.controller.id };

      if ( $scope.controller.sensors.length > 0) {

        Controllers.delete_sensore(params, $scope.controller).$promise
            .then(function () {
              $scope.$broadcast('asuno-refresh-all');
            }, function() {
              $scope.error = 'Произошла ошибка изменения счетчика.';
            });
      } else {
        Controllers.add_sensore(params, $scope.controller).$promise
            .then(function () {
              $scope.$broadcast('asuno-refresh-all');
            }, function() {
              $scope.error = 'Произошла ошибка изменения счетчика.';
            });
      }
    };


    $rootScope.unlinkDirection = function (directionId) {

      $log.debug('unlinkDirection ', directionId);
      let params = {id: $scope.controller.id, direction_id: directionId};

      let unlink = Scheme.direction_unlink_cable(params, params).$promise;

      unlink
        .then(() => {
          $scope.$broadcast('asuno-refresh-all');
      }, () => {
          $scope.error = 'Произошла ошибка сети';
      });

    };


    $rootScope.setDirectionId = function(directionId) {
      $rootScope.directionId = directionId;
    };
    $rootScope.linkDirection = function (cabelId, closeModal) {

      let params = {id: $scope.controller.id, direction_id: $rootScope.directionId};

      let unlink = Scheme.direction_link_cable(params, {cable_id: cabelId}).$promise;

      unlink
          .then(() => {
        $scope.$broadcast('asuno-refresh-all');
        closeModal();
      }, () => {
        $scope.error = 'Произошла ошибка сети';
        closeModal();
      });
      $rootScope.directionId = null;
    };

    $rootScope.timelineInit = function (_begin, _end) {
      begin = _begin;
      end = _end;
      $scope.main.globalLocked = true;
      _initialController = ControllerFactory.copyController($scope.controller);

      var timelineStart = moment(begin).add(-1, 'd').toDate();

      function checkResponse(response) {
        return !$scope.main.globalLocked || new Date(response.data.last_date) > end;
      }

      function _createMapper(type) {
        return function (item) {
          item.timestamp = new Date(item.timestamp).getTime();
          item.__type__ = type;
          return item;
        };
      }

      var mapper = _createMapper('sensors');
      var monitorMapper = _createMapper('monitor');

      var sensorHistory = Sensors.history($scope.controller.sid, timelineStart, checkResponse)
              .then((history) => history.map(mapper));

      var monitorsHistory = Monitors.history($scope.controller.sid, timelineStart, checkResponse)
              .then((history) => history.map(monitorMapper));

        return $q.all([monitorsHistory, sensorHistory])
          .then(function (result) {
            var states = _(result)
                    .flatten()
                    .partition((s) => s.timestamp < begin.getTime())
            .value();

            pastTimeline = states[0];
            timeline = states[1];
            return timeline;
          })
          .then(function (timeline) {
            if ($scope.main.globalLocked) {
              _applyTick(pastTimeline);
              _applyInitialState(begin);
            }
            return timeline;
          });
    };

    var timelineTick = function (tick, nextTick, initial) {
      $log.debug(tick, nextTick);

      var ticked = _(timeline);

      if (initial) {
        $scope.controller = ControllerFactory.copyController(_initialController);
        _applyTick(pastTimeline);
        _applyInitialState(begin);
        ticked = ticked.filter((item) => item.timestamp <= nextTick);
      } else {
        ticked = ticked.filter((item) => item.timestamp <= nextTick && item.timestamp >= tick);
      }

      ticked = ticked.filter((item) => item.timestamp <= nextTick && item.timestamp >= tick)
      .sortBy((item) => item.timestamp)
      .value();

      _applyTick(ticked);
    };

    var timelineStop = function () {
      if (_initialController.id) {
        $scope.controller = ControllerFactory.copyController(_initialController);
      }
      $scope.main.globalLocked = false;
      $scope.$broadcast('asuno-refresh-all');
    };

    TimelineService.on('timeline-tick', timelineTick);
    TimelineService.on('timeline-stop', timelineStop);

    function setController() {
      if (!$scope.main.globalLocked && !mutex.isLocked() && !$rootScope.isJournalTab()) {
        mutex.lock();

        Controllers.get({
          controller: $scope.controller.id
        }).$promise
          .then(function (controller) {
            if (!$scope.main.globalLocked && !$scope.editingInSession) {
              $scope.controller = controller;
            }
            mutex.release();
          });
      }
    }

    $scope.$on(tickEvent, setController);

    $scope.$on('asuno-refresh-all', setController);

    $scope.selectController = function (controller) {
      $state.go('core.controller', {
        rdp: $scope.rdp.slug,
        controller: controller.id
      });
    };

    $scope.child = $scope.$new();

    $scope.pointFilter = function (attributes) {
      return attributes.PP_ID === $scope.controller.gis_id;
    };

    $log.debug('ControllerCtrl');

    let cabelsId = [];

    Controllers.all_cables({}, {}).$promise
      .then((data) => {
        cabelsId = data.cables.map(function(cable) { return cable.cabel_id; });
    });

    $scope.lepFilter = function (attributes) {
      return cabelsId.indexOf(attributes.CABEL_ID) > 0;
    };


    $scope.cameraExtractor = function (graphic) {
      var cameras = $scope.controller.cameras.map(function (camera) {
        return camera.stream_uri;
      });

      if (cameras.indexOf(graphic.attributes.purl) >= 0) {
        return 1;
      }
    };

    $scope.cameraExtractor = function (graphic) {
      var cameras = $scope.controller.cameras.map(function (camera) {
        return camera.stream_uri;
      });

      if (cameras.indexOf(graphic.attributes.purl) >= 0) {
        return 1;
      }
    };

    $scope.filterToday = function () {
      if (!$scope.filters.filterToday) {
        $scope.filters.filterToday = true;
        var today = moment().startOf('day').toDate();
        var tomorrow = moment().add(1, 'd').startOf('day').toDate();

        angular.extend($scope.filters, {
          dateFrom: today,
          dateTo: tomorrow
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
        sid: $scope.controller.sid,
        after: next.dateFrom,
        before: next.dateTo,
        alarms: next.alarms,
        unacknowledged: next.unacknowledged
      });
    }, true);

    $scope.$on('$destroy', function () {
      TimelineService.removeListener('timeline-tick', timelineTick);
      TimelineService.removeListener('timeline-stop', timelineStop);
    });

    $rootScope.journalInOtherTab = false;
    $scope.$on('$viewContentLoaded', function(){
      if ( $state.params.journalExpand ) {
        $rootScope.expandJournal();
      } else {
        $rootScope.constrictJournal();
      }
    });

    $scope.$applyAsync();
  }

  angular.module('asuno').controller('ControllerCtrl', ControllerCtrl);
})();
