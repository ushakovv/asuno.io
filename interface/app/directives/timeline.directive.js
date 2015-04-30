(function () {
  'use strict';

  angular.module('asuno')
    .directive('timeline', function timeline() {
      return {
        templateUrl: '/assets/templates/line.html',
        replace: true,
        scope: true,
        bindToController: true,
        controller: 'TimelineController as tl'
      };
    })
    .controller('TimelineController', function TimelineController($scope, $rootScope, $timeout, $log, $modal, TimelineService, HeatMap) {
      var tl = this;

      tl.speed = 1000;
      tl.status = 'STOP';

      tl.canPlay = function () {
        return tl.status === 'STOP' || tl.status === 'PAUSE';
      };

      tl.canStop = function () {
        return tl.status === 'PLAY' || tl.status === 'PAUSE' || tl.status === 'STOP';
      };

      tl.canPause = function () {
        return tl.status === 'PLAY';
      };

      tl.showConfig = function () {
        var instance = $modal.open({
          templateUrl: '/assets/templates/modals/timeline-modal.html'
        });

        tl.currentId = _.uniqueId();

        const afterInit = (currentId) => {
          return (timelineData) => {
            if (currentId === tl.currentId) {
              tl.heatMap = HeatMap.createHeatMap(timelineData, tl.conf.dateFrom, tl.conf.dateTo);
              tl.loading = false;
            }
          };
        };

        instance.result
          .then(function (conf) {
            tl.stop();
            tl.conf = conf;
            tl.currentTime = new Date(conf.dateFrom);
            tl.allTime = tl.conf.dateTo - tl.conf.dateFrom;

            tl.loading = true;

            return $rootScope.timelineInit(new Date(conf.dateFrom), new Date(conf.dateTo));
          })
          .then(afterInit(tl.currentId));
      };

      tl.showConfig();

      var tick;

      tl.togglePlay = function () {
        if (tl.status !== 'PLAY') {
          tl.status = 'PLAY';

          if (!tick) {
            tick = function () {
              var nextTime = tl.currentTime.getTime() + tl.speed;

              TimelineService.emit('timeline-tick', tl.currentTime.getTime(), nextTime);

              if (nextTime > tl.conf.dateTo.getTime()) {
                tl.currentTime = tl.conf.dateTo;
                tl.progress = '100%';
              } else {
                tl.currentTime.setTime(nextTime);
                tl.progress = (tl.currentTime - tl.conf.dateFrom) * 100 / tl.allTime + '%';
              }

              if (tl.currentTime < tl.conf.dateTo && tl.status === 'PLAY') {
                $timeout(tick, 1000);
              } else {
                tick = void 0;
                TimelineService.emit('timeline-stop');
              }
            };

            $timeout(tick, 1000);
          }
        } else if (tl.status === 'PLAY') {
          tl.status = 'PAUSE';
        }
      };

      tl.heatMapClick = function (heatMapItem) {
        if (tl.status === 'PLAY') {
          tl.togglePlay();
          if (heatMapItem.start >= tl.currentTime.getTime()) {
            TimelineService.emit('timeline-tick', tl.currentTime.getTime(), new Date(heatMapItem.start).getTime());
          } else {
            TimelineService.emit('timeline-tick', tl.conf.dateFrom.getTime(), new Date(heatMapItem.start).getTime(), true);
          }
          tl.currentTime = new Date(heatMapItem.start);
          tl.togglePlay();
        } else {
          if (heatMapItem.start >= tl.currentTime.getTime()) {
            TimelineService.emit('timeline-tick', tl.currentTime.getTime(), new Date(heatMapItem.start).getTime());
          } else {
            TimelineService.emit('timeline-tick', tl.conf.dateFrom.getTime(), new Date(heatMapItem.start).getTime(), true);
          }
          tl.currentTime = new Date(heatMapItem.start);
          tl.progress = (tl.currentTime - tl.conf.dateFrom) * 100 / tl.allTime + '%';
        }
      };

      tl.stop = function () {
        tl.conf = void 0;
        tl.currentTime = void 0;
        tl.progress = 0;
        tl.status = 'STOP';
        tl.loading = false;
        tl.speed = 1000;
        tl.heatMap = [];
        tick = void 0;
        TimelineService.emit('timeline-stop');
      };

      tl.setSpeedMultiplier = function (multiplier) {
        tl.speed = tl.speed * multiplier;
      };

      $rootScope.$on('$stateChangeStart', function () {
        tl.stop();
        $rootScope.timelineState.show = false;
      });

      $scope.$on('$destroy', function () {
        tl.stop();
      });
    });
})();
