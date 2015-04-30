(function () {
  'use strict';

  function SidebarAdmController(Auth) {
    var sidebar = this;

    sidebar.isAdmin = function () {
      return Auth.isAdmin();
    };

    sidebar.isDispatcher = function () {
      return Auth.isDispatcher();
    };

    sidebar.dispatchedRdp = function () {
      return Auth.session().user.dispatcher.rdp;
    };
  }

  angular.module('asuno').controller('SidebarAdmController', SidebarAdmController);
})();
