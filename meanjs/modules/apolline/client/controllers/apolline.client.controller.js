(function () {
    'use strict';
  
    angular
      .module('apolline')
      .controller('ApollineController', ApollineController);
  
      ApollineController.$inject = ['$scope'];
  
    function ApollineController(Authentication) {
      var vm = this;
      vm.authentication = Authentication;
    }
  }());