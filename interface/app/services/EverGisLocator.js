/**
 * Created by vasa on 02.09.14.
 */

(function () {
  'use strict';

  /* global sGis */

  var providers = ['msk'];
  var services = ['egko'];

  function EverGisLocator($q) {

    var evergisProcessor, controller;

    this.addressSearch = function (query) {

      return $q(function (resolve, reject) {
        if (!evergisProcessor) {
          evergisProcessor = new sGis.SpatialProcessor({
            url: 'http://' + location.hostname + '/eg_public/SpatialProcessor/IIS/',
            login: 'jspublic',
            password: 'jspublic',
            controllers: ['superSearch']
          });
        }

        if (!controller) {
          controller = evergisProcessor.controller.superSearch;
        }

        controller.addressSearch({
          string: query,
          providers: providers,
          services: services,
          error: function () {
            reject();
          },
          success: function () {
            var rows = controller.tree.rows;

            if (Object.keys(rows).length === 0) {
              rows = [];
            }

            var result = _(rows)
              .map(function (row) {
                if (row.dataType === 'LeafNode') {
                  var label = row.data.Extension.Content.Second
                    .replace('город федерального значения ', '')
                    .replace('Москва ', '')
                    .replace('городской округ', '')
                    .replace('городское поселение ', '')
                    .replace('муниципальный ', '')
                    .replace('административный округ ', 'АО ')
                    .replace('район ', 'р-н ');

                  return {
                    label: label,
                    value: label,
                    location: {
                      x: row.data.Envelope.xmin,
                      y: row.data.Envelope.ymin
                    }
                  };
                }
              })
              .filter()
              .value();

            resolve(result);
          }
        });
      });
    };
  }

  angular.module('asuno').service('EverGisLocator', EverGisLocator);
})();
