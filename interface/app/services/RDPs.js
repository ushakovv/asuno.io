/**
 * Created by vasa on 26.03.14.
 */

(function () {
  'use strict';

  function RDP(rdp) {
    angular.extend(this, rdp);

    this.night = rdp.enabled;
    this.disabled = rdp.controllers - rdp.enabled || 0;
  }

  function RDPs(resource) {
    return resource('/api/rdp/:rdp', {rdp : '@slug'}, {
      query     : {
        method : 'GET', url : '/api/stats', isArray : true, transformResponse : function (data) {
          return _(JSON.parse(data).stats)
            .map('rdps')
            .flatten()
            .map(function (rdp) {
              return new RDP(rdp);
            })
            .value();
        }
      },
      query_groups  : {
        method : 'GET', url : '/api/rdp/rdp_groups', isArray : true, transformResponse : function (data) {
          return JSON.parse(data).groups;
        }
      },
      query_group  : {
        method : 'GET', url : '/api/rdp/rdp_groups/:id', transformResponse : function (data) {
          return JSON.parse(data);
        }
      },
      query_no  : {
        method : 'GET', url : '/api/stats', isArray : true, transformResponse : function (data) {
          return _(JSON.parse(data).stats)
            .filter(function (stat) {
              return stat.sid === 'obekty-no';
            })
            .map('rdps')
            .flatten()
            .map(function (rdp) {
              return new RDP(rdp);
            })
            .value();
        }
      },
      query_ahp : {
        method : 'GET', url : '/api/stats', isArray : true, transformResponse : function (data) {
          return _(JSON.parse(data).stats)
            .filter(function (stat) {
              return stat.sid === 'akhp';
            })
            .map('rdps')
            .flatten()
            .map(function (rdp) {
              return new RDP(rdp);
            })
            .value();
        }
      },
      get       : {
        method : 'GET', transformResponse : function (data) {
          return JSON.parse(data).rdp;
        }
      }
    });
  }

  angular.module('asuno').service('RDPs', RDPs);
})();
