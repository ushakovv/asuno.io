/**
 * Created by vasa on 30.09.14.
 */

//jshint ignore:start
/* eslint-disable */

describe('Auth service', function () {

  var logins = {
    'rdp1_user' : {username : 'rdp1_user', password : 'secret_rdp1', realm : 'mkad-2km', fio : 'Иванов Иван Иванович'},
    'rdp2_user' : {username : 'rdp2_user', password : 'secret_rdp2', realm : 'armianskii', fio : 'Иванов Иван Иванович'},
    'cdp_user'  : {username : 'cdp_user', password : 'super_secret_cdp', realm : 'cdp', fio : 'Иванов Иван Иванович'},
    'ermolaev'  : {username : 'ermolaev', password : 'ermolaev_secret', realm : 'cdp', fio : 'Ермолаев Артем Валерьевич'},
    'belozerov' : {username : 'belozerov', password : 'belozerov_secret', realm : 'cdp', fio : 'Белозеров Андрей Сергеевич'},
    'dit_user'  : {username : 'dit_user', password : 'secret_dit', realm : 'dit', fio : 'Иванов Иван Иванович'}
  };

  beforeEach(module('asuno.services'));

  beforeEach(inject(function ($httpBackend) {
    Object.keys(logins).forEach(function (key) {
      $httpBackend.when('GET', '/api/authenticate/' + encodeURIComponent(key)).respond(200, 'OK');
    });
  }));

  it('should have logged out state before login', inject(function (Auth) {
    expect(Auth.isLoggedIn()).toBe(false)
  }));

  it('should return rejected promise, given wrong credentials', inject(function (Auth, $rootScope) {
    Auth.login('WRONG_USER', 'WRONG_PASSWORD')
      .then(function (res) {
        $rootScope.response = res
      }, function () {
        $rootScope.error = true
      });

    $rootScope.$apply();

    expect($rootScope.response).toBeUndefined();
    expect($rootScope.error).toBe(true);
  }));

  it('should return resolved promise, given right credentials', inject(function (Auth, $rootScope) {
    for (var login in logins) {
      if (logins.hasOwnProperty(login)) {
        Auth.login(login, logins[login].password)
          .then(function (res) {
            $rootScope.response = res
          }, function () {
            $rootScope.error = true
          });

        $rootScope.$apply();

        expect($rootScope.response).toBeTruthy();
        expect($rootScope.error).toBeUndefined();
      }
    }
  }));

  it('should be logged in after login', inject(function (Auth) {
    for (var login in logins) {
      if (logins.hasOwnProperty(login)) {
        Auth.login(login, logins[login].password);
        expect(Auth.isLoggedIn()).toBe(true)
      }
    }
  }));

  it('should give the right session data after login', inject(function (Auth) {
    for (var login in logins) {
      if (logins.hasOwnProperty(login)) {
        Auth.login(login, logins[login].password);
        expect(Auth.session()).toEqual(logins[login]);
      }
    }
  }));

  it('should be logged out after logout', inject(function (Auth) {
    Auth.logout();
    expect(Auth.isLoggedIn()).toBe(false)
  }))
});
