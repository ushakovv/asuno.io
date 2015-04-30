/**
 * Created by vasa on 02.10.14.
 */

//jshint ignore:start
/* eslint-disable */

describe('Controllers Service', function () {
  var controllers = {controllers : [
    {
      "address"         : "улица 1",
      "enabled"         : false,
      "gis_id"          : null,
      "id"              : 123,
      "is_cascade"      : false,
      "last_response"   : "1970-01-01T00:00:00+00:00",
      "latitude"        : null,
      "longitude"       : null,
      "maintenance_due" : null,
      "name"            : "Контроллер 12",
      "rdp_id"          : 3,
      "status"          : {
        "common_alarm" : true,
        "connection"   : null,
        "door"         : null,
        "fire"         : null,
        "lock"         : null
      },
      "uri"             : "kontroller-12"
    },
    {
      "address"         : "проезд 1",
      "enabled"         : false,
      "gis_id"          : null,
      "id"              : 124,
      "is_cascade"      : false,
      "last_response"   : "1970-01-01T00:00:00+00:00",
      "latitude"        : null,
      "longitude"       : null,
      "maintenance_due" : null,
      "name"            : "Контроллер 13",
      "rdp_id"          : 3,
      "status"          : {
        "common_alarm" : null,
        "connection"   : true,
        "door"         : null,
        "fire"         : null,
        "lock"         : null
      },
      "uri"             : "kontroller-12"
    },
    {
      "address"         : "площадь 1",
      "enabled"         : false,
      "gis_id"          : null,
      "id"              : 125,
      "is_cascade"      : false,
      "last_response"   : "1970-01-01T00:00:00+00:00",
      "latitude"        : null,
      "longitude"       : null,
      "maintenance_due" : null,
      "name"            : "Контроллер 14",
      "rdp_id"          : 3,
      "status"          : {
        "common_alarm" : null,
        "connection"   : null,
        "door"         : true,
        "fire"         : null,
        "lock"         : null
      },
      "uri"             : "kontroller-12"
    },
    {
      "address"         : "переулок 1",
      "enabled"         : false,
      "gis_id"          : null,
      "id"              : 126,
      "is_cascade"      : false,
      "last_response"   : "1970-01-01T00:00:00+00:00",
      "latitude"        : null,
      "longitude"       : null,
      "maintenance_due" : null,
      "name"            : "Контроллер 15",
      "rdp_id"          : 3,
      "status"          : {
        "common_alarm" : null,
        "connection"   : null,
        "door"         : null,
        "fire"         : true,
        "lock"         : null
      },
      "uri"             : "kontroller-12"
    },
    {
      "address"         : "проезд 2",
      "enabled"         : false,
      "gis_id"          : null,
      "id"              : 127,
      "is_cascade"      : false,
      "last_response"   : "1970-01-01T00:00:00+00:00",
      "latitude"        : null,
      "longitude"       : null,
      "maintenance_due" : null,
      "name"            : "Контроллер 16",
      "rdp_id"          : 3,
      "status"          : {
        "common_alarm" : null,
        "connection"   : null,
        "door"         : null,
        "fire"         : null,
        "lock"         : true
      },
      "uri"             : "kontroller-12"
    },
    {
      "address"         : "спуск 1",
      "enabled"         : true,
      "gis_id"          : null,
      "id"              : 128,
      "is_cascade"      : false,
      "last_response"   : "1970-01-01T00:00:00+00:00",
      "latitude"        : null,
      "longitude"       : null,
      "maintenance_due" : null,
      "name"            : "Контроллер 17",
      "rdp_id"          : 3,
      "status"          : {
        "common_alarm" : null,
        "connection"   : null,
        "door"         : null,
        "fire"         : null,
        "lock"         : null
      },
      "uri"             : "kontroller-12"
    },
    {
      "address"         : "шоссе 1",
      "enabled"         : true,
      "gis_id"          : null,
      "id"              : 129,
      "is_cascade"      : false,
      "last_response"   : "1970-01-01T00:00:00+00:00",
      "latitude"        : null,
      "longitude"       : null,
      "maintenance_due" : "1970-01-01T00:00:00+00:00",
      "name"            : "Контроллер 18",
      "rdp_id"          : 3,
      "status"          : {
        "common_alarm" : null,
        "connection"   : null,
        "door"         : null,
        "fire"         : null,
        "lock"         : null
      },
      "uri"             : "kontroller-12"
    }
  ]};

  beforeEach(module('asuno.services'));

  beforeEach(inject(function ($httpBackend) {
    $httpBackend.expect('GET', '/api/controllers?rdp=xxx')
      .respond(200, controllers)
  }));

  afterEach(inject(function ($httpBackend) {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));

  it('should GET /api/controllers?rdp=xxx', inject(function ($httpBackend, Controllers) {
    Controllers.query({rdp : 'xxx'}, {});
    $httpBackend.flush();
  }));

  it('should put "disabled" and "night" according to "enabled"', inject(function ($httpBackend, Controllers) {
    var ctrls = Controllers.query({rdp : 'xxx'}, {});
    $httpBackend.flush();
    ctrls.forEach(function (ctrl) {
      if (ctrl.enabled) {
        expect(ctrl.hasOwnProperty('disabled')).toBe(false);
        expect(ctrl.night).toBe(true);
      } else {
        expect(ctrl.hasOwnProperty('night')).toBe(false);
        expect(ctrl.disabled).toBe(true);
      }
    });
  }));

});
