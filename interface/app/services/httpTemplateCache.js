/**
 * Created by vasa on 07.04.14.
 */

(function () {
  'use strict';

  /**
   * @ngdoc service
   * @author Vasily Chinarev http://github.com/vasa-chi/
   * @name httpTemplateCache
   *
   * @requires $q
   * @requires $templateCache
   * @requires $http
   *
   * @description
   * Обертка над `$templateCache` для получения шаблона в виде `Deferred`.
   * Шаблон загружается только при первом обращении.
   */
  function HttpTemplateCache($q, $http, $templateCache) {

    /**
     * @ngdoc method
     * @name get
     * @description
     * Ищет шаблон по переданному имени в $templateCache. Если шаблон не найден,
     * то пытается загрузиьть по `templateUrl`. В случае, если шаблон загружен,
     * то кладет шаблон в `$templateCache` и резолвит вернувшийся `Deferred`
     * В случае, если шаблон найти не удалось, обещание будет отменено.
     *
     * @param {string} templateUrl название или URL шаблона. Должен быть непустой строкой.
     * @returns {Deferred} обещание, в котором будет либо шалон, либо причина,
     * по которой найти его не удалось
     */
    this.get = function (templateUrl) {
      return $q((resolve, reject) => {
        if (typeof templateUrl !== 'string' || !templateUrl) {
          reject(new Error(`templateUrl must be not-empty string, got: ${templateUrl}` ));
        } else {
          var template = $templateCache.get(templateUrl);
          if (template) {
            resolve(template);
          } else {
            $http.get(templateUrl)
              .success((data) => {
                $templateCache.put(templateUrl, data);
                resolve(data);
              })
              .error((data, status) => reject(new Error(`HTTP ${status}! ${data}`)));
          }
        }
      });
    };
  }

  angular.module('asuno.services').service('httpTemplateCache', HttpTemplateCache);
})();
