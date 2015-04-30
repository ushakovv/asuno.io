/**
 * Created by vasa on 18.09.14.
 */

(function () {
  'use strict';

  angular.module('asuno')
    .directive('scheduleTable', function scheduleTable() {
      return {
        templateUrl      : '/assets/templates/schedule-table.tmpl.html',
        replace          : true,
        scope            : true,
        bindToController : true,
        controller       : 'ScheduleTableController as st',
        link             : function (scope, element) {
          element.on('click', 'tr.schedule__month__name', function () {
            $(this).closest('tbody.schedule__month').toggleClass('schedule__month--hide');
          });
        }
      };
    })
    .controller('ScheduleTableController', function ScheduleTableController($scope, Schedule) {
      var st = this;

      Schedule.get({time : 'year'}, function (data) {
        var today = new Date();
        var currentMonth = today.getMonth() + 1;

        var mon;

        function _filterCurrentMonth(day) {
          return day.month === mon;
        }

        var schedule = [];
        var origSchedule = data.schedule.map(function (day) {
          var date = new Date(day.date);

          return angular.extend(day, {
            month      : date.getMonth() + 1,
            day        : date.getDate(),
            is_current : today.getDate() === date.getDate() && today.getMonth() === date.getMonth(),
            dark_time  : day.dark_time.substring(0, day.dark_time.length - 3)
          });
        });

        for (mon = 1; mon <= 12; mon++) {
          var month = {
            mon        : mon,
            is_current : mon === currentMonth,
            days       : origSchedule.filter(_filterCurrentMonth)
          };
          schedule.push(month);
        }

        st.schedule = schedule;
      });
    });
})();
