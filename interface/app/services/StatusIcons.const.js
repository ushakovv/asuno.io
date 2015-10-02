/**
 * Created by vasa on 03.07.14.
 */

(function () {
  'use strict';

  var STATUS_ICONS = [
    {src : '/assets/img/input.png', srcSm : '/assets/img/avaria_red.png', srcNokvit : '/assets/img/input.gif', key : 'common_alarm'},
    {src : '/assets/img/fire.png', srcSm : '/assets/img/fire14.png', srcNokvit : '/assets/img/fire.gif', key : 'fire'},
    {src : '/assets/img/disconnect.png', srcSm : '/assets/img/disconnect14.png', srcNokvit : '/assets/img/disconnect.gif', key : 'connection'},
    {src : '/assets/img/block.png', srcSm : '/assets/img/block14.png', srcNokvit : '/assets/img/lock.gif', key : 'lock'},
    {src : '/assets/img/door.png', srcSm : '/assets/img/door14.png', srcNokvit : '/assets/img/door.gif', key : 'door'},
    {src : '/assets/img/contactor.png', srcSm : '/assets/img/contactor14.png', srcNokvit : '/assets/img/contactor.gif', key : 'manual'}
  ];

  angular.module('asuno').constant('STATUS_ICONS', STATUS_ICONS);
})();
