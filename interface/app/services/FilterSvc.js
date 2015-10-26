/**
 * Created by vasa on 19.08.14.
 */

(function () {
  'use strict';

  var FILTER_CONFIGS = {
    'all'             : 'id',
    'fire'            : 'fire',
    'lock'            : 'lock',
    'connection'      : 'connection',
    'door'            : 'door',
    'common_alarm'    : 'common_alarm',
    'autonomous'      : 'autonomous',
    'night'           : 'night',
    'disabled'        : 'disabled',
    'maintenance_due' : 'maintenance_due'
  };

  var FILTER_CONFIGS_BATCH = angular.extend({}, FILTER_CONFIGS, {'all' : 'controllers'});

  function FilterSvc(Monitors) {
    this._objects = {};

    function _checkController(controller, key) {
      return controller[FILTER_CONFIGS[key]] || Monitors.isActive(controller.alarms[FILTER_CONFIGS[key]]);
    }

    this.add = function (key, amt) {
      amt = amt || 1;
      this._objects[key] = (this._objects[key] || 0) + amt;
    };

    this.clear = function () {
      this._objects = {};
    };

    this.count = function (key) {
      return this._objects[key] || 0;
    };

    this.parseController = function (controller) {
      Object.keys(FILTER_CONFIGS)
        .filter((key) => _checkController(controller, key))
        .forEach((key) => this.add(key));
    };

    this.parseRDP = function (rdp) {
      Object.keys(FILTER_CONFIGS_BATCH)
        .map((key) => { return {key, count: rdp[FILTER_CONFIGS_BATCH[key]]}; })
        .filter(({count}) => angular.isNumber(count))
        .forEach(({key, count}) => this.add(key, count));
    };
  }

  angular.module('asuno.services').constant('FILTER_CONFIGS', FILTER_CONFIGS);
  angular.module('asuno.services').constant('FILTER_CONFIGS_BATCH', FILTER_CONFIGS_BATCH);
  angular.module('asuno.services').service('FilterSvc', FilterSvc);
})();
