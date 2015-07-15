/**
 * Created by vasa on 17.09.14.
 */

(function () {
  'use strict';

  function ReportFormatter() {
    this.format_alarm = function (event) {
      var emergency = event.state.payload === 'emergency';
      var timestamp = event.timestamp;
      if ( isNaN( timestamp * 1 ) && timestamp.indexOf('Z') < 0 ) {
        timestamp = timestamp + 'Z';
      }
      return {
        id: event.id,
        timestamp: new Date(timestamp),
        object: event.monitor.ancestors.controller.name,
        object_id: event.monitor.ancestors.controller.id,
        rdp: event.monitor.ancestors.rdp,
        hr_name: event.denotation,
        description: event.denotation,
        emergency: emergency,
        silent: event.silent,
        silenced_by: event.silenced_by,
        silent_model: emergency && event.silent,
        fontWeight: !emergency || event.silent ? 'normal' : 'bold',
        backgroundColor: !emergency || event.silent ? '#ffffff' : 'rgba(255, 0, 0, 0.2)',
        comment: event.comment,
        comment_saved: !!event.comment
      };
    };

    this.format_alarm_tl = function (event, controller, rdp) {
      var emergency = event.state.payload === 'emergency';
      var timestamp = event.timestamp;
      if ( isNaN( timestamp * 1 ) && timestamp.indexOf('Z') < 0 ) {
        timestamp = timestamp + 'Z';
      }
      return {
        id: event.id,
        timestamp: new Date(timestamp),
        object: controller ? controller.name : '',
        object_id: controller ? controller.id : null,
        rdp: rdp ? rdp : null,
        hr_name: event.denotation,
        description: event.denotation,
        emergency: emergency,
        silent: event.silent,
        silenced_by: event.silenced_by,
        silent_model: emergency && event.silent,
        fontWeight: !emergency || event.silent ? 'normal' : 'bold',
        backgroundColor: !emergency || event.silent ? '#ffffff' : 'rgba(255, 0, 0, 0.2)',
        comment: event.comment,
        comment_saved: !!event.comment
      };
    };
  }

  angular.module('asuno').service('ReportFormatter', ReportFormatter);
})();
