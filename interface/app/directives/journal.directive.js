(function () {
  'use strict';

  angular.module('asuno')
    .directive('journal', function $name() {
      return {
        replace          : true,
        templateUrl      : '/assets/templates/journal.tmpl.html',
        scope            : {
          name        : '@',
          options     : '=',
          query       : '=',
          map         : '=',
          time        : '@',
          rdp         : '@',
          rdpName     : '@',
          controllers : '=',
          alarms      : '=',
          kvit        : '@',
          order       : '@'
        },
        bindToController : true,
        controller       : 'JournalController as journal'
      };
    })
    .controller('JournalController', function JournalController($scope, RDPs, $log, Muter, ngGridBase, Events, $rootScope) {
      var journal = this;

      var _uniqueJournalLoad;

      journal.report = {};
      journal.filters = {};

      if (journal.rdp || journal.rdpName) {
        journal.rdps = RDPs.query();
      }
      $scope.journalEvents = [];

      journal.load = function (options, page, per_page) {
        var currentLoad = _uniqueJournalLoad = _.uniqueId();

        journal.report.loading = true;
        journal.currentOptions = options;
        journal.pagingOptions.currentPage = page || 1;

        var query = angular.extend({}, options, {
          page     : page,
          per_page : per_page
        });
        $log.debug('journal.report.loading', journal.report.loading);
        journal.query(query, function (data) {
          $log.debug(currentLoad === _uniqueJournalLoad, 'query');
          if (currentLoad === _uniqueJournalLoad) {
            journal.report.loading = false;
            journal.totalServerCount = data.total;

            $scope.journalEvents = journal.map(data);
            journal.options.data = 'journalEvents';
          }
        });
      };

      journal.reload = function (page, per_page) {
        journal.load(journal.currentOptions, page, per_page);
      };

      journal.totalServerCount = 0;
      journal.pagingOptions = {
        pageSizes   : [100],
        pageSize    : 100,
        currentPage : 1
      };

      journal.filterToday = function () {
        if (!journal.filters.filterToday) {
          journal.filters.filterToday = true;
          var today = moment().startOf('day').toDate();
          var tomorrow = moment().add(1, 'd').startOf('day').toDate();

          angular.extend(journal.filters, {
            dateFrom : today,
            dateTo   : tomorrow
          });
        } else {
          delete journal.filters.filterToday;

          angular.extend(journal.filters, {
            dateFrom : null,
            dateTo   : null
          });
        }
      };

      journal.selectedEvents = [];

      journal.toggleKvit = function (event, silent) {
        if (silent) {
          journal.selectedEvents.push(event.id);
        } else {
          journal.selectedEvents = journal.selectedEvents.filter(function (id) {
            return id !== event.id;
          });
        }
      };

      journal.massKvit = function (events) {
        journal.kvitLoading = true;
        Muter.mute_batch(events).finally(function () {
          journal.selectedEvents = [];
          journal.reload();
          journal.kvitLoading = false;
        });
      };

      journal.filterUnacknowledged = function () {
        if (journal.filters.unacknowledged === 1) {
          delete journal.filters.unacknowledged;
          delete journal.filters.alarms;
        } else {
          journal.filters.unacknowledged = 1;
          journal.filters.alarms = 1;
        }
      };

      journal.sortInfo = {columns : [], fields : [], directions : []};

      journal.isEmergency = function isEmergency(entity) {
        $log.debug('isEmergency', entity);
        return entity && ( (entity.state && entity.state.payload && entity.state.payload === 'emergency') || !!entity.emergency );
      };

      journal.isHasIssue = function isHasIssue(entity){
        $log.debug('isHasIssue', entity);
        return entity && entity.ufap_id && parseInt(entity.ufap_id, 10) > 0;
      };

      journal.createIssue = function (event) {
        Events.create_issue({id : event.id}, {id : event.id})
            .$promise
            .finally(function () {
              journal.reload();
            });
      };
      $rootScope.$on('asuno-refresh-all', function () {
          journal.reload();
      });

      $scope.$watch('journal.pagingOptions', function (next, prev) {
        if (next.currentPage !== prev.currentPage) {
          journal.reload(next.currentPage, next.pageSize);
        }
      }, true);

      $scope.$watch('journal.filters', function (next) {
        next = next || {};
        journal.load(angular.extend({}, journal.currentOptions, {
          after          : next.dateFrom,
          before         : next.dateTo,
          sid            : next.rdp || next.controller,
          alarms         : journal.alarms ? 1 : next.alarms,
          unacknowledged : next.unacknowledged
        }));
      }, true);

      $scope.$watch('journal.sortInfo', function (next, prev) {
        var order = [], prevOrder = [];

        next.fields.forEach(function (field, idx) {
          order.push(next.directions[idx] === 'asc' ? field : '-' + field);
        });

        prev.fields.forEach(function (field, idx) {
          prevOrder.push(prev.directions[idx] === 'asc' ? field : '-' + field);
        });

        if (!angular.equals(order, prevOrder)) {
          journal.load(angular.extend({}, journal.currentOptions, {sort : order}));
        }
      }, true);

      if (journal.kvit) {
        journal.options.columnDefs.push({
          field        : '',
          width        : '**',
          displayName  : 'Квитировать',
          cellTemplate : `<div class="ngCellText" style="text-align: center">
                            <span class="ok" ng-if="row.entity.silenced_by"><i class="fa fa-check"></i>Профилактика</span>
                            <input if-has-control type="checkbox" ng-if="row.entity.emergency && !row.entity.silenced_by" ng-model="row.entity.silent_model" ng-disabled="row.entity.silent" ng-change="journal.toggleKvit(row.entity, row.entity.silent_model)">
                          </div>`
        });
      }

      if (journal.order) {
        journal.options.columnDefs.push({
          field        : '',
          displayName  : 'Заявка',
          width        : '*',
          cellTemplate : '<div class="ngCellText" style="text-align: center">' +
            '<span ng-if="row.entity.emergency">' +
              '<span ng-if="!row.entity.ufap_id"><a href="javascript:void(0)" ng-click="journal.createIssue(row.entity)">создать</a></span>' +
              '<span ng-if="row.entity.ufap_id">№{{row.entity.ufap_id}}</span>' +
            '</span>',
          sortable     : false
        });
      }

      if (journal.kvit || journal.order) {
        journal.options.rowTemplate = ` <div ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}" ng-style="{'cursor': row.cursor, 'background-color': row.entity.backgroundColor, 'font-weight': row.entity.fontWeight }">
                                          <div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div>
                                          <div ng-cell></div>
                                        </div>`;
      }

      journal.options = angular.extend({}, ngGridBase, journal.options, {
          data               : 'journalEvents',
          enablePaging       : true,
          showFooter         : true,
          pagingOptions      : journal.pagingOptions,
          totalServerItems   : 'journal.totalServerCount',
          sortInfo           : journal.sortInfo,
          useExternalSorting : true
        }
      );
    });

})();
