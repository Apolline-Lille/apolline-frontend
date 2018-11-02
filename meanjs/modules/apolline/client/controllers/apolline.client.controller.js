(function () {
  'use strict';

  angular
    .module('apolline')
    .controller('ApollineController', ApollineController);

  ApollineController.$inject = ['$scope', 'apollineResolve', 'Authentication'];

  function ApollineController($scope, apolline, Authentication) {
    var vm = this;

    vm.apolline = apolline;
    vm.authentication = Authentication;

  }
}());