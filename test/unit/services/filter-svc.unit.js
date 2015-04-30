/**
 * Created by vasa on 02.10.14.
 */

//jshint ignore:start
/* eslint-disable */

describe('FilterSvc service', function () {
  var rdp = {
    "address"        : "\u041c\u041a\u0410\u0414, \u0434.2",
    "common_alarm"   : 1,
    "connection"     : 1,
    "controllers"    : 49,
    "door"           : null,
    "enabled"        : null,
    "events"         : 3456,
    "fire"           : null,
    "gis_id"         : 30,
    "id"             : 1,
    "latitude"       : 21599.0501098633,
    "lock"           : null,
    "longitude"      : 11234.7446899414,
    "name"           : "\u041c\u041a\u0410\u0414 2\u043a\u043c",
    "on_maintenance" : null,
    "slug"           : "mkad-2km"
  };

  var controllers = [
    {
      "address"         : "\u0422\u0432\u0435\u0440\u0441\u043a\u0430\u044f 16/2",
      "enabled"         : true,
      "night"           : true,
      "gis_id"          : 24733,
      "id"              : 50,
      "is_cascade"      : false,
      "last_response"   : "2014-10-02T09:01:31+00:00",
      "latitude"        : null,
      "longitude"       : null,
      "maintenance_due" : "2014-10-02T09:01:31+00:00",
      "name"            : "\u0412\u0420\u0423-14016",
      "rdp_id"          : 2,
      "status"          : {
        "common_alarm" : true,
        "connection"   : true,
        "door"         : true,
        "fire"         : true,
        "lock"         : true
      }
    },
    {
      "address"         : "\u0422\u0432\u0435\u0440\u0441\u043a\u0430\u044f 16/2",
      "enabled"         : false,
      "disabled"        : true,
      "gis_id"          : 24733,
      "id"              : 50,
      "is_cascade"      : false,
      "last_response"   : "2014-10-02T09:01:31+00:00",
      "latitude"        : null,
      "longitude"       : null,
      "maintenance_due" : null,
      "name"            : "\u0412\u0420\u0423-14016",
      "rdp_id"          : 2,
      "status"          : {
        "common_alarm" : null,
        "connection"   : null,
        "door"         : null,
        "fire"         : null,
        "lock"         : null
      }
    }
  ];

  beforeEach(module('asuno.services'));

  it('should have return zero any filter key by default', inject(function (FILTER_CONFIGS, FilterSvc) {
    Object.keys(FILTER_CONFIGS).forEach(function (key) {
      expect(FilterSvc.count(key)).toBe(0)
    })
  }));

  it('should add 1 to filter on .add() with falsy value', inject(function (FILTER_CONFIGS, FilterSvc) {
    Object.keys(FILTER_CONFIGS).forEach(function (key) {
      expect(FilterSvc.count(key)).toBe(0);

      FilterSvc.add(key);
      expect(FilterSvc.count(key)).toBe(1);

      FilterSvc.add(key, 0);
      expect(FilterSvc.count(key)).toBe(2);

      FilterSvc.add(key, null);
      expect(FilterSvc.count(key)).toBe(3);
    })
  }));

  it('should add given amount to filter on .add()', inject(function (FILTER_CONFIGS, FilterSvc) {
    Object.keys(FILTER_CONFIGS).forEach(function (key) {
      expect(FilterSvc.count(key)).toBe(0);
      var count = Math.round(Math.random() * 100) + 1;
      FilterSvc.add(key, count);

      expect(FilterSvc.count(key)).toBe(count)
    })
  }));

  it('should drop all keys to 0 after .clear()', inject(function (FILTER_CONFIGS, FilterSvc) {
    Object.keys(FILTER_CONFIGS).forEach(function (key) {
      FilterSvc.add(key, Math.round(Math.random() * 100) + 1);
    });

    FilterSvc.clear();

    Object.keys(FILTER_CONFIGS).forEach(function (key) {
      expect(FilterSvc.count(key)).toBe(0);
    });
  }));

  it('should correcty populate filters after .parseRDP()', inject(function (FILTER_CONFIGS_BATCH, FilterSvc) {
    FilterSvc.parseRDP(rdp);

    Object.keys(FILTER_CONFIGS_BATCH).forEach(function (key) {
      expect(FilterSvc.count(key)).toBe(rdp[FILTER_CONFIGS_BATCH[key]] || 0)
    })
  }));

  it('should correcty populate filters after .parseController()', inject(function (FILTER_CONFIGS, FilterSvc) {
    controllers.forEach(FilterSvc.parseController, FilterSvc);

    Object.keys(FILTER_CONFIGS).forEach(function (key) {
      expect(FilterSvc.count(key)).toBe(controllers.filter(function (ctrl) {
        return ctrl[FILTER_CONFIGS[key]] || ctrl.status[FILTER_CONFIGS[key]]
      }).length)
    })
  }));
});
