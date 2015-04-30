(function () {
  'use strict';

  function Muter($q, Mute) {

    this.mute_batch = function (events) {
      return $q.all(events.map((id) => Mute.mute_event({id}, {}).$promise));
    };
  }

  angular.module('asuno.services').service('Muter', Muter);
})();
