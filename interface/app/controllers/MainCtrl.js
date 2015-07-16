/**
 * Created by vasa on 26.03.14.
 */

(function () {
  'use strict';

  function MainCtrl($scope, $rootScope, $q, $timeout, Auth, Events, Mute, ReportFormatter, Mutex, ngGridBase, rdps, tickEvent) {
    var mutex = Mutex.create();

    $scope.rdps = rdps;
    $rootScope.user = Auth.session();
    $rootScope.search = {};
    $scope.alarms = [];

    $scope.main = {
      globalLocked: false
    };

    $scope.report = {};

    $scope.totalServerCount = 0;
    $scope.pagingOptions = {
      pageSizes   : [6],
      pageSize    : 6,
      currentPage : 1
    };

    var _uniqueJournalLoad = _.uniqueId();

    $scope.load_alarms = function (options, page, per_page) {

      if (!$scope.main.globalLocked) {
        mutex.lock();
        $scope.selectedEvents = [];
        $scope.currentOptions = options;
        $scope.pagingOptions.currentPage = page || $scope.pagingOptions.currentPage;
        $scope.pagingOptions.pageSize = per_page || $scope.pagingOptions.pageSize;
        var query = angular.extend({}, options, {
          page     : $scope.pagingOptions.currentPage,
          per_page : $scope.pagingOptions.pageSize
        });

        var currentLoad = _uniqueJournalLoad = _.uniqueId();
        $scope.report.loading = true;
        Events.query(query, function (events) {
          if (currentLoad === _uniqueJournalLoad && !$scope.main.globalLocked) {
            $scope.totalServerCount = events.total;

            $scope.alarms = events.events.map(ReportFormatter.format_alarm);
            $scope.selectedEvents = [];
            delete $scope.report.loading;
          }
          mutex.release();
        });
      }
    };

    $scope.reload_alarms = function (page, per_page) {

      if (!mutex.isLocked() && !$scope.main.globalLocked) {
        mutex.lock();
        var currentLoad = _uniqueJournalLoad;
        var query = angular.extend({}, $scope.currentOptions, {page, per_page});
        Events.query(query, function (events) {
          if (!$scope.main.globalLocked && currentLoad === _uniqueJournalLoad && !$scope.editingInSession && $scope.selectedEvents.length === 0) {
            $scope.totalServerCount = events.total;
            $scope.alarms = events.events.map(ReportFormatter.format_alarm);
          }
          mutex.release();
        });
      }
    };

    $scope.$on(tickEvent, function () {
      $scope.reload_alarms($scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
    });



    $scope.$watch('pagingOptions.currentPage', function (next, prev) {
      if (next !== prev) {
        $scope.load_alarms($scope.currentOptions, next, $scope.pagingOptions.pageSize);
      }
    });

    $scope.selectedEvents = [];
    $scope.addEvent = function (event) {
      $scope.selectedEvents.push(event);
    };
    $scope.createIssue = function (event) {
      Events.create_issue({id : event.id}, {id : event.id})
          .$promise
          .finally(function () {
            $scope.reload_alarms($scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
          });
    };
    $scope.removeEvent = function (event) {
      $scope.selectedEvents = _.filter($scope.selectedEvents, (evt) => evt.id !== event.id);
    };

    $scope.isHasIssue = function isHasIssue(entity){
      return entity.issue && !!parseInt(entity.issue.ufap_id, 10);
    };

    $scope.isEmergency = function isEmergency(entity) {
      return (entity.state && entity.state.payload && entity.state.payload === 'emergency') || !!entity.emergency;
    };

    $scope.massMute = function () {
      $scope.muteLoading = true;

      var promises = $scope.selectedEvents.map(function (event) {
        return Mute.mute_event({id : event.id}, {}).$promise;
      });

      $q.all(promises)
        .finally(function () {
          $scope.muteLoading = false;
          $scope.selectedEvents = [];
          $scope.reload_alarms($scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
        });
    };

    $scope.sortInfo = {columns : [], fields : [], directions : []};

    $scope.$watch('sortInfo', function (next, prev) {
      if (!angular.equals(next, prev)) {
        var order = [];
        next.fields.forEach(function (field, idx) {
          if (['timestamp', 'object', 'hr_name', 'comment'].indexOf(field) >= 0) {
            order.push(next.directions[idx] === 'asc' ? field : '-' + field);
          }
        });

        $scope.load_alarms(angular.extend({}, $scope.currentOptions, {sort : order}), 1, $scope.pagingOptions.pageSize);
      }
    }, true);

    $rootScope.alertsGridOptions = angular.extend({}, ngGridBase, {
      data                : 'alarms',
      enablePaging        : true,
      showFooter          : true,
      pagingOptions       : $scope.pagingOptions,
      enableCellSelection : true,
      totalServerItems    : 'totalServerCount',
      sortInfo            : $scope.sortInfo,
      useExternalSorting  : true,
      rowTemplate         : '<div ng-style="{ \'cursor\': row.cursor, \'background-color\': row.entity.backgroundColor, \'font-weight\': row.entity.fontWeight }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()"\n     class="ngCell {{col.cellClass}}" >\n  <div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div>\n  <div ng-cell></div>\n</div>\n',
      columnDefs          : [
        {
          field        : 'timestamp',
          displayName  : 'Дата',
          cellTemplate : '<div class="ngCellText">{{row.getProperty(col.field)|serverDate|date:"dd.MM.yyyy"}}</div>'
        },
        {
          field        : 'timestamp',
          displayName  : 'Время',
          cellTemplate : '<div class="ngCellText">{{row.getProperty(col.field)|serverDate|date:"HH:mm:ss"}}</div>'
        },
        {
          field        : 'rdp', displayName : 'РДП', visible : true, sortable : false,
          cellTemplate : '<div class="ngCellText"><a ui-sref="core.rdp({rdp: row.entity.rdp.slug})">{{row.getProperty(col.field).name}}</a></div>'
        },
        {
          field        : 'object', displayName : 'Объект',
          cellTemplate : '<div class="ngCellText"><a ui-sref="core.controller({rdp: row.entity.rdp.slug, controller: row.entity.object_id})">{{row.getProperty(col.field)}}</a></div>'
        },
        {
          field        : 'hr_name',
          displayName  : 'Описание',
          width        : '***',
          cellTemplate : '<div class="ngCellText" ng-attr-title="{{row.getProperty(col.field)}}">{{row.getProperty(col.field)}}</div>'
        },
        {
          field                 : 'comment',
          displayName           : 'Комментарий',
          width                 : '***',
          enableCellEdit        : Auth.hasControl(),
          cellEditableCondition : '!row.entity.comment_saved'
        },
        {
          field        : '',
          displayName  : 'Квитировать',
          width        : '**',
          cellTemplate : '<div class="ngCellText" style="text-align: center"><span class="ok" ng-if="row.entity.silenced_by"><i class="fa fa-check"></i>{{row.entity.silenced_by}}</span><input type="checkbox" if-has-control ng-if="row.entity.emergency && !row.entity.silenced_by" ng-model="row.entity.silent_model" ng-disabled="row.entity.silent" ng-change="row.entity.silent_model ? addEvent(row.entity) : removeEvent(row.entity)"></div>',
          sortable     : false
        },
        {
          field        : '',
          displayName  : 'Заявка',
          width        : '*',
          cellTemplate : '<div class="ngCellText" style="text-align: center">' +
            '<span ng-if="isEmergency(row.entity)">' +
              '<span ng-if="!isHasIssue(row.entity)"><a href="javascript:void(0)" ng-click="createIssue(row.entity)">создать</a></span>' +
              '<span ng-if="isHasIssue(row.entity)">Отправлена №{{row.entity.issue.ufap_id}}</span>' +
            '</span>',
          sortable     : false
        }
      ]
    });

    $rootScope.$on('ngGridEventStartCellEdit', function () {
      $scope.editingInSession = true;
    });

    $rootScope.$on('ngGridEventEndCellEdit', function (evt) {
      if (evt && evt.targetScope.col.field === 'comment') {
        var entity = evt.targetScope.row.entity;

        if (evt.targetScope.row.getProperty('comment')) {
          Events.comment({id : entity.id}, {comment : (evt.targetScope.row.getProperty('comment') + '        ').substring(0, 140)})
            .$promise
            .then(function () {
              $scope.editingInSession = false;
              entity.comment_saved = true;
            })
            .finally(function () {
              $scope.reload_alarms($scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
            });
        }
      } else {
        $scope.editingInSession = false;
      }
    });

    $rootScope.$on('asuno-refresh-all', function () {
      $scope.reload_alarms($scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
    });

    $rootScope.journalExpanded = false;
    $rootScope.expandJournal = function expandJournal() {
      $rootScope.journalExpanded = true;
        $scope.pagingOptions.pageSize = 100;
        $scope.load_alarms($scope.currentOptions, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
        $timeout(function () {
          $('.gridStyle').each(function () {
            var $el = $(this);
            $el.css('height', $(window).height() - $el.offset().top - 15);
          });
          $(window).resize();
        }, 100);
    };
    $rootScope.constrictJournal = function constrictJournal() {
      $('.gridStyle').each(function () {
          var $el = $(this);
          $el.css('height', '');
        });
        $rootScope.journalExpanded = false;
        $scope.pagingOptions.pageSize = 6;
        $scope.load_alarms($scope.currentOptions, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
        $(window).resize();

    };
    $rootScope.toggleJournalHeight = function () {
      if (!$rootScope.journalExpanded) {
        $rootScope.expandJournal();
      } else {
        $rootScope.constrictJournal();
      }
    };
  }

  angular.module('asuno').controller('MainCtrl', MainCtrl);
})();
