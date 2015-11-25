/**
 * Created by vasa on 25.03.14.
 */

(function () {
  'use strict';

  window.ngGrid.i18n['ru-RU'] = {
    ngAggregateLabel: 'строки',
    ngGroupPanelDescription: 'Drag a column header here and drop it to group by that column.',
    ngSearchPlaceHolder: 'Поиск...',
    ngMenuText: 'Выберите колонки:',
    ngShowingItemsLabel: 'Показано:',
    ngTotalItemsLabel: 'Всего строк:',
    ngSelectedItemsLabel: 'Выбрано:',
    ngPageSizeLabel: 'Строк:',
    ngPagerFirstTitle: 'Первая страница',
    ngPagerNextTitle: 'Следующая страница',
    ngPagerPrevTitle: 'Предыдущая страница',
    ngPagerLastTitle: 'Последняя страница'
  };

  angular.module('asuno.services', ['ngResource', 'ngCookies', 'asuno.confirmation']);

  angular.module('asuno', ['ngResource', 'ngCookies', 'ui.router', 'ngGrid',
                           'ui.bootstrap.buttons', 'ui.bootstrap.modal', 'ui.bootstrap.tabs',
                           'ui.bootstrap.typeahead', 'ui.bootstrap.tpls', 'ui.bootstrap.accordion',
                           'ui.bootstrap.alert', 'ui.bootstrap.progressbar', 'ui.bootstrap.dropdown',
                           'ui.bootstrap.carousel',
                           'mgcrea.ngStrap.datepicker', 'mgcrea.ngStrap.timepicker', 'mgcrea.ngStrap.tooltip',
                           'mgcrea.ngStrap.helpers.dimensions', 'mgcrea.ngStrap.helpers.dateParser',
                           'mgcrea.ngStrap.popover', 'angular-storage', 'ui.bootstrap-slider',
                           'nvd3ChartDirectives',
                           'asuno.services'])
    .config(function ($httpProvider, $stateProvider, $urlRouterProvider, $rootScopeProvider, $locationProvider, $sceDelegateProvider, $compileProvider, $logProvider, $tooltipProvider, $datepickerProvider) {

      $compileProvider.debugInfoEnabled(false);
      $logProvider.debugEnabled(false);

      $tooltipProvider.defaults.appendToBody = true;

      angular.extend($datepickerProvider.defaults, {
        dateFormat: 'dd.MM.yyyy',
        startWeek: 1,
        autoclose: true
      });

      $locationProvider.html5Mode(false);
      $locationProvider.hashPrefix('!');

      $sceDelegateProvider.resourceUrlWhitelist([
        // собственные ресурсы
        'self',

        // видеонаблюдение
        'http://GOST_GR_Pronyayev:17596777@195.208.65.189:8087/**',
        'http://GOST_GR_Pronyayev:17596777@195.208.65.189:8088/**',
        'http://195.208.65.189:8088/**',
        'http://195.208.65.189:8088/**'
      ]);

      $urlRouterProvider.otherwise(function ($injector) {
        var Auth = $injector.get('Auth');
        if (Auth.isDispatcher()) {
          return '/rdps/' + Auth.session().user.dispatcher.rdp.slug;
        } else if (Auth.isLoggedIn()) {
          return '/select';
        } else {
          return '/login';
        }
      });

      $stateProvider
        .state('core', {
          url: '',
          'abstract': true,
          controller: 'MainCtrl',
          templateUrl: '/assets/templates/ui-main.html',
          resolve: {
            rdps: function (RDPs, Auth) {
              if (Auth.isDispatcher()) {
                return [Auth.session().user.dispatcher.rdp];
              } else {
                return RDPs.query_no().$promise;
              }
            }
          }
        })
        .state('login', {
          url: '/login',
          controller: 'LoginController',
          templateUrl: '/assets/templates/pages/login.html'
        })
        .state('choice', {
          url: '/select',
          controller: 'ChoiceCtrl',
          templateUrl: '/assets/templates/pages/choice.html'
        })
        .state('rdp.groups', {
          url: '/rdp_groups/:rdp',
          data: {
            allowRdp: true
          },
          views: {
            '': {
              controller: 'RDPController',
              templateUrl: '/assets/templates/pages/rdp.html',
              resolve: {
                initial: function ($stateParams, RDPs, Controllers) {
                  return RDPs.query_group({rdp: $stateParams.rdp})
                    .$promise
                    .then(function(rdp) {
                      return Controllers.query({sid: rdp.sid, head: 1, no_niitm: true})
                          .$promise
                          .then((controllers) => { return {rdp, controllers}; });
                    });
                }
              }
            },
            'sidebar': {
              templateUrl: '/assets/templates/pages/sidebar-with-groups.html'
            }
          }
        })
        .state('tp', {
          url: '/tp',
          templateUrl: '/assets/templates/pages/tps.html'
        })
        .state('tpone', {
          url: '/tp/1',
          templateUrl: '/assets/templates/pages/tp.html'
        })
        .state('group', {
          url: '/group',
          templateUrl: '/assets/templates/pages/group.html'
        })
        .state('ua', {
          url: '/ua',
          templateUrl: '/assets/templates/pages/ua.html'
        })
        .state('ahp', {
          url: '/ahp',
          templateUrl: '/assets/templates/pages/ahp.html'
        })
        .state('sensors', {
          url:'',
          'abstract': true,
          templateUrl: '/assets/templates/ui-main.html'
        })
        .state('sensors.light', {
          url: '/light',
          templateUrl: '/assets/templates/pages/light.html',
          controller: 'LightSensorsController as light'
        })
        .state('core.rdps', {
          url: '/rdps',
          views: {
            '': {
              controller: 'RDPsController',
              templateUrl: '/assets/templates/pages/rdps.html'
            },
            'sidebar': {
              templateUrl: '/assets/templates/pages/sidebar-navigation-only.html'
            }
          }
        })
        .state('core.rdp', {
          url: '/rdps/:rdp?x&y&rid&journalExpand',
          data: {
            allowRdp: true
          },
          views: {
            '': {
              controller: 'RDPController',
              templateUrl: '/assets/templates/pages/rdp.html',
              resolve: {
                initial: function ($stateParams, RDPs, Controllers) {
                  return RDPs.get({rdp: $stateParams.rdp})
                    .$promise
                    .then(function(rdp) {
                      return Controllers.query({sid: rdp.sid, head: 1})
                          .$promise
                          .then((controllers) => { return {rdp, controllers}; });
                    });
                }
              }
            },
            'sidebar': {
              templateUrl: '/assets/templates/pages/sidebar-with-groups.html'
            }
          }
        })
        .state('core.rdp2', {
          url: '/rdp_groups/:rdp?x&y&rid&journalExpand',
          data: {
            allowRdp: true
          },
          views: {
            '': {
              controller: 'RDPController',
              templateUrl: '/assets/templates/pages/rdp.html',
              resolve: {
                initial: function ($stateParams, RDPs, Controllers) {
                  return RDPs.query_group({id : $stateParams.rdp})
                    .$promise
                    .then(function(rdp) {
                      return Controllers.query({sid: rdp.sid, head: 1, no_niitm: true})
                          .$promise
                          .then(function (controllers) {
                            function sEmergency(a, b) { // По возрастанию
                              var one, two;

                              for(var i= 0; i < a.alarms.common_alarm.length; ++i){
                                if(a.alarms.common_alarm[i].payload == "emergency") one = true;
                              }

                              for(var k= 0; k < b.alarms.common_alarm.length; ++k){
                                if(b.alarms.common_alarm[k].payload == "emergency") two = true;
                              }


                              if (one && !two)
                                return -1;
                              else if (!one && two)
                                return 1;
                              else
                                return 0;
                            }
                            controllers.sort(sEmergency);

                            return {rdp, controllers};
                          });
                    });
                }
              }
            },
            'sidebar': {
              templateUrl: '/assets/templates/pages/sidebar-with-groups.html'
            }
          }
        })
        .state('core.controller', {
          url: '/rdps/:rdp/:controller?journalExpand',
          data: {
            allowRdp: true
          },
          views: {
            '': {
              controller: 'ControllerCtrl',
              templateUrl: '/assets/templates/pages/controller.html',
              resolve: {
                controller: function ($stateParams, Controllers) {
                  return Controllers.get({
                    controller: $stateParams.controller
                  }).$promise;
                }
              }
            },
            'sidebar': {
              templateUrl: '/assets/templates/pages/sidebar-navigation-only.html'
            }
          }
        })
        .state('core.controllerSpecial', {
          url: '/rdpssp/:rdp/:controller',
          data: {
            allowRdp: true
          },
          views: {
            '': {
              controller: 'CascadeControllerCtrl',
              templateUrl: '/assets/templates/pages/controllerCascade.html',
              resolve: {
                rdp: function ($stateParams, RDPs) {
                  return RDPs.get({
                    rdp: $stateParams.rdp
                  }).$promise;
                },
                controller: function ($stateParams, Controllers) {
                  return Controllers.get({
                    controller: $stateParams.controller,
                    cascade: 1
                  }).$promise;
                }
              }
            },
            'sidebar': {
              templateUrl: '/assets/templates/pages/sidebar-with-groups.html'
            }
          }
        })
        .state('report', {
          url: '/report',
          'abstract': true,
          templateUrl: '/assets/templates/ui-main.html'
        })
        .state('report.operativeReport', {
          url: '/operative',
          views: {
            '': {
              controller: 'OperativeReportCtrl',
              templateUrl: '/assets/templates/pages/operativeReport.html'
            },
            'sidebar': {
              templateUrl: '/assets/templates/pages/journal-sidebar.html'
            }
          }
        })
        .state('report.switchesReport', {
          url: '/switches',
          views: {
            '': {
              controller: 'SwitchesReportCtrl',
              templateUrl: '/assets/templates/pages/switchesReport.html'
            },
            'sidebar': {
              templateUrl: '/assets/templates/pages/journal-sidebar.html'
            }
          }
        })
        .state('report.externalReport', {
          url: '/external',
          views: {
            '': {
              controller: 'ExternalReportController',
              templateUrl: '/assets/templates/pages/externalReport.html'
            },
            'sidebar': {
              templateUrl: '/assets/templates/pages/journal-sidebar.html'
            }
          }
        })
        .state('report.userReport', {
          url: '/user',
          views: {
            '': {
              controller: 'UserActionsReport',
              templateUrl: '/assets/templates/pages/userReport.html'
            },
            'sidebar': {
              templateUrl: '/assets/templates/pages/journal-sidebar.html'
            }
          }
        })
        .state('report.actionsReport', {
          url: '/actions',
          views: {
            '': {
              controller: 'ControlReportController',
              templateUrl: '/assets/templates/pages/control-report.html'
            },
            'sidebar': {
              templateUrl: '/assets/templates/pages/journal-sidebar.html'
            }
          }
        })
        .state('report.alarmsReport', {
          url: '/alarms',
          views: {
            '': {
              controller: 'AlarmsReportCtrl',
              templateUrl: '/assets/templates/pages/alarmsReport.html'
            },
            'sidebar': {
              templateUrl: '/assets/templates/pages/journal-sidebar.html'
            }
          }
        })
        .state('report.maintenanceReport', {
          url: '/maintenance',
          views: {
            '': {
              controller: 'MaintenanceReportCtrl',
              templateUrl: '/assets/templates/pages/maintenanceReport.html'
            },
            'sidebar': {
              templateUrl: '/assets/templates/pages/journal-sidebar.html'
            }
          }
        })
        .state('report.alertsReport', {
          url: '/alertsReport',
          views: {
            '': {
              controller: 'AlertsReportController',
              templateUrl: '/assets/templates/pages/alertsReport.html'
            },
            'sidebar': {
              templateUrl: '/assets/templates/pages/journal-sidebar.html'
            }
          }
        })
        .state('report.lightReport', {
          url: '/lightReport',
          views: {
            '': {
              controller: 'ReportCtrl',
              templateUrl: '/assets/templates/pages/lightReport.html'
            },
            'sidebar': {
              templateUrl: '/assets/templates/pages/journal-sidebar.html'
            }
          }
        })
        .state('report.timeLagReport', {
          url: '/timeLag',
          views: {
            '': {
              controller: 'TimeLagReportCtrl',
              templateUrl: '/assets/templates/pages/time-lag-report.html'
            },
            'sidebar': {
              templateUrl: '/assets/templates/pages/journal-sidebar.html'
            }
          }
        })
        .state('adm', {
          url: '/adm',
          'abstract': true,
          templateUrl: '/assets/templates/ui-main.html'
        })
        .state('adm.rdps', {
          url: '/rdps',
          views: {
            '': {
              templateUrl: '/assets/templates/pages/adm/rdps.html',
              controller: 'RdpsAdmController',
              resolve: {
                rdps: function (RDPs) {
                  return RDPs.query().$promise;
                }
              }
            },
            'sidebar': {
              templateUrl: '/assets/templates/sidebar/adm.html',
              controller: 'SidebarAdmController as sidebar'
            }
          }
        })
        .state('adm.states', {
          url: '/states',
          views: {
            '': {
              templateUrl: '/assets/templates/pages/adm/states.html',
              controller: 'StatesAdmController'
            },
            'sidebar': {
              templateUrl: '/assets/templates/sidebar/adm.html',
              controller: 'SidebarAdmController as sidebar'
            }
          }
        })
        .state('adm.rdp', {
          url: '/rdps/:rdp',
          data: {
            allowRdp: true
          },
          views: {
            '': {
              templateUrl: '/assets/templates/pages/adm/rdp.html',
              controller: 'RdpAdmController',
              resolve: {
                initial: function ($stateParams, RDPs, Controllers) {
                  return RDPs.get({rdp: $stateParams.rdp})
                    .$promise
                    .then(function(rdp) {
                      return Controllers.query({sid: rdp.sid})
                        .$promise
                        .then((controllers) => {return {rdp, controllers}; });
                    });
                }
              }
            },
            'sidebar': {
              templateUrl: '/assets/templates/sidebar/adm.html',
              controller: 'SidebarAdmController as sidebar'
            }
          }
        })
        .state('adm.controller', {
          url: '/rdps/:rdp/:controller',
          data: {
            allowRdp: true
          },
          views: {
            '': {
              templateUrl: '/assets/templates/pages/adm/controller.html',
              controller: 'ControllerAdmCtrl as cac',
              resolve: {
                controller: function ($stateParams, Controllers) {
                  return Controllers.get({
                    controller: $stateParams.controller
                  }).$promise;
                }
              }
            },
            'sidebar': {
              templateUrl: '/assets/templates/sidebar/adm.html',
              controller: 'SidebarAdmController as sidebar'
            }
          }
        })
        .state('adm.controller.scheme', {
          url: '/scheme',
          data: {
            allowRdp: true
          },
          templateUrl: '/assets/templates/pages/adm/controller-scheme.html',
          controller: 'ControllerSchemeCtrl'
        })
        .state('adm.users', {
          url: '/users',
          views: {
            '': {
              templateUrl: '/assets/templates/pages/adm/users.html',
              controller: 'UsersCtrl as usersAdm',
              resolve: {
                users: function (Users) {
                  return Users.query().$promise;
                }
              }
            },
            'sidebar': {
              templateUrl: '/assets/templates/sidebar/adm.html',
              controller: 'SidebarAdmController as sidebar'
            }
          }
        })
        .state('adm.user', {
          url: '/users/:id',
          views: {
            '': {
              templateUrl: '/assets/templates/pages/adm/user.html',
              controller: 'UserCtrl as userAdm',
              resolve: {
                user: function ($stateParams, Users) {
                  return Users.get({
                    id: $stateParams.id
                  }).$promise;
                },
                roles: function (Users) {
                  return Users.roles().$promise;
                },
                rdps: function (RDPs) {
                  return RDPs.query().$promise;
                }
              }
            },
            'sidebar': {
              templateUrl: '/assets/templates/sidebar/adm.html',
              controller: 'SidebarAdmController as sidebar'
            }
          }
        })
        .state('schedule', {
          url: '/schedule',
          templateUrl: '/assets/templates/pages/schedule.html'
        });

      $httpProvider.interceptors.push('TokenInterceptor');
      $httpProvider.useApplyAsync(true);
    })
    .value('SPATIAL_REFERENCE', {
      'wkt': 'PROJCS["Moscow_bessel",GEOGCS["GCS_Bessel_1841",DATUM["D_Bessel_1841",SPHEROID["Bessel_1841",6377397.155,299.1528128]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",37.5],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",55.66666666666666],UNIT["Meter",1.0]]'
    })
    .constant('ngGridBase', {
      i18n: 'ru-RU',
      enableSorting: true,
      rowHeight: 22,
      headerRowHeight: 22,
      footerRowHeight: 28
    })
    .constant('asunoSessionCookie', 'asuno-user')
    .constant('tickEvent', 'asuno.tick')
    .run(function ($rootScope, $sci, $interval, $http, $state, $modal, $location, $window, Auth, ControllersStoreConstants, FilterSvc, ControllersActions, MassOperations, RemoteCommandListener, RemoteCommandSocket, tickEvent) {
      let timeouts = {
        standart: 10000,
        more: 3000,
        getTimeout: function() {
          return $state.is('core.rdp') || $state.is('core.controller') ? this.more : this.standart;
        }
      };
      let counter = 0;
      let tick = $interval(() => $rootScope.$broadcast(tickEvent, counter++), timeouts.getTimeout());

      $rootScope.$state = $state;
      $rootScope.timelineState = {};
      $rootScope.location = window.location;

      $rootScope.inState = function (states) {
        if (typeof states === 'string') {
          return $state.is(states);
        } else {
          return _.any(states, function (state) {
            return $state.is(state);
          });
        }
      };

      $rootScope.isJournalTab = function() {
        return !!$location.search().journalExpand;
      };
      $rootScope.isNavbarOn = function() {
        return !$rootScope.inState('login') && !$rootScope.isJournalTab();
      };

      var applicationWindow = angular.element($window);
      $rootScope.$watch(
        function () {
          return {
              height: applicationWindow.height(), 
              width: applicationWindow.width()
          };
        }, 
        function (newValue, oldValue) {
          if (newValue && (newValue.height !== oldValue.height || newValue.width !== oldValue.width)) {
            var header = angular.element(document).find('header')[0];
            var headerPadding = angular.element(document).find('#header-padding')[0];
            if (header && headerPadding) {
              var width = header.clientWidth;
              var height = header.clientHeight;
              angular.element(headerPadding).width(width);
              angular.element(headerPadding).height(height);
            }
          }
        },
        true
      );

      $rootScope.$on('$stateChangeSuccess', function () {
        ControllersActions.clear();
        FilterSvc.clear();

        if ($rootScope.sidebar) {
          $rootScope.sidebar.show = false;
        }

        if (tick) {
          $interval.cancel(tick);
        }

        tick = $interval(() => $rootScope.$broadcast(tickEvent, counter++), timeouts.getTimeout());
      });

      $rootScope.$on('$stateChangeError', function () {
        if (tick) {
          $interval.cancel(tick);
        }
        tick = $interval(() => $rootScope.$broadcast(tickEvent, counter++), timeouts.getTimeout());
      });

      var authTokenRefresh;

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        if (!Auth.isLoggedIn() && authTokenRefresh) {
          $interval.cancel(authTokenRefresh);
          authTokenRefresh = null;
        }

        if (tick) {
          $interval.cancel(tick);
        }

        if (toState.name !== 'login' && !Auth.isLoggedIn()) {
          event.preventDefault();
          $state.go('login');
        } else if (Auth.isLoggedIn()) {

          if (Auth.isDispatcher()) {
            if (!(toState.data && toState.data.allowRdp && toParams.rdp === Auth.session().user.dispatcher.rdp.slug)) {
              event.preventDefault();
              $state.go('core.rdp', {
                rdp: Auth.session().user.dispatcher.rdp.slug
              });
            }
          }

          if (!authTokenRefresh) {
            Auth.refresh()
              .then(function () {
                if (!authTokenRefresh) {
                  authTokenRefresh = $interval(function () {
                    Auth.refresh().catch(function () {
                      $state.go('login');
                    });
                  }, 100000);

                  $rootScope.$on('$destroy', function () {
                    $interval.cancel(authTokenRefresh);
                  });
                }
              })
              .catch(function (reason) {
                if (reason.status === 401) {
                  $state.go('login');
                }
              });
          }
        }
      });

      $rootScope.$broadcast(tickEvent, counter++);

      $rootScope.$on('$destroy', () => $interval.cancel(tick));

      $rootScope.$on('logged-in', () => {
        $sci.connect();

        RemoteCommandListener.installListener();
        RemoteCommandSocket.installListener();
      });

      $rootScope.$on('logged-out', () => {
        RemoteCommandListener.removeListener();
        RemoteCommandSocket.removeListener();
        $state.go('login');
      });

      if (!Auth.isLoggedIn()) {
        $state.go('login');
      } else {
        $rootScope.$broadcast('logged-in');
      }

      MassOperations.installListener();
    });
})();
