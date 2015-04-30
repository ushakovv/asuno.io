/**
 * Created by vasa on 30.09.14.
 */

//jshint ignore:start
/* eslint-disable */

describe('httpTemplateCache Service', function () {
  beforeEach(module('asuno.services'));

  beforeEach(inject(function ($httpBackend) {
    $httpBackend.expect('GET', 'some/url/template.html')
      .respond('<span>some template</span>')
  }));

  afterEach(inject(function ($httpBackend) {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));

  it('should have a "get" method, returning a promise', inject(function ($httpBackend, httpTemplateCache) {
    var response = httpTemplateCache.get('some/url/template.html');
    $httpBackend.flush();

    expect(typeof response.then).toBe("function")
  }));

  it('should resolve into a template string if the url is right', inject(function ($httpBackend, httpTemplateCache) {
    var template;

    httpTemplateCache.get('some/url/template.html')
      .then(function (response) {
        template = response
      });
    $httpBackend.flush();

    expect(template).toEqual('<span>some template</span>')
  }));

  it('should reject if the url is wrong', inject(function ($httpBackend, httpTemplateCache) {
    var result;

    $httpBackend.expect('GET', 'some/wrong/url/template.html').respond(404, 'File not found');

    httpTemplateCache.get('some/url/template.html');
    httpTemplateCache.get('some/wrong/url/template.html')
      .then(function (response) {
        result = response
      }, function (response) {
        result = response
      });
    $httpBackend.flush();

    expect(result instanceof Error).toBe(true)
  }));

  it('should reject if the url is not a string or is empty', inject(function ($httpBackend, $rootScope, httpTemplateCache) {
    httpTemplateCache.get('some/url/template.html');

    httpTemplateCache.get('').catch(function (reason) {
      $rootScope.result = reason
    });

    $httpBackend.flush();

    expect($rootScope.result instanceof Error).toBe(true);

    $rootScope.result = void 0;

    httpTemplateCache.get(123).catch(function (reason) {
      $rootScope.result = reason
    });

    $rootScope.$apply();

    expect($rootScope.result instanceof Error).toBe(true);
  }));

  it('doesn\'t hit backend twice', inject(function ($httpBackend, $rootScope, httpTemplateCache) {
    var template1, template2;

    httpTemplateCache.get('some/url/template.html').then(function (response) {
      template1 = response;
    });
    $httpBackend.flush();

    httpTemplateCache.get('some/url/template.html').then(function (response) {
      template2 = response;
    });

    $rootScope.$apply();

    expect(template1).toBe(template2);
  }));
});