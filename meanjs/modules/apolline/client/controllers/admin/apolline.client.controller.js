(function () {
    'use strict';
  
    angular
      .module('apolline.admin')
      .controller('ApollineAdminController', ApollineAdminController);
  
    ApollineAdminController.$inject = ['$scope', '$state', '$window', 'apollineResolve', 'Authentication', 'Notification'];
  
    function ApollineAdminController(Authentication) {
      var vm = this;
      vm.form = {};
    }
  }());
  