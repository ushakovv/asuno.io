/**
 * Created by vasa on 02.10.14.
 */

//jshint ignore:start
/* eslint-disable */

describe('Mute service', function () {
  beforeEach(module('asuno.services'));

  it('should POST to /api/events/:id/mute/ on mute_event({id: ?}, {})', inject(function ($httpBackend, Mute) {
    $httpBackend.expect('POST', '/api/events/1/mute').respond(200, 'OK');
    $httpBackend.expect('POST', '/api/events/2/mute').respond(200, 'OK');
    $httpBackend.expect('POST', '/api/events/3/mute').respond(200, 'OK');

    for (var i = 1; i < 4; i++) {
      Mute.mute_event({id : i}, {});
    }

    $httpBackend.flush();

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));

  it('should POST to /api/controllers/:id/acknowledge on mute_controller({id: ?}, {})', inject(function ($httpBackend, Mute) {
    $httpBackend.expect('POST', '/api/controllers/1/acknowledge').respond(200, 'OK');
    $httpBackend.expect('POST', '/api/controllers/2/acknowledge').respond(200, 'OK');
    $httpBackend.expect('POST', '/api/controllers/3/acknowledge').respond(200, 'OK');

    for (var i = 1; i < 4; i++) {
      Mute.mute_controller({id : i}, {});
    }

    $httpBackend.flush();

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }))
});
