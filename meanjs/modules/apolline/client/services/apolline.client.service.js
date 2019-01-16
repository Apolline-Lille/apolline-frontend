(function () {
    'use strict';
  
    angular
      .module('apolline.services')
      .factory('ApollineService', ApollineService);
  
      ApollineService.$inject = ['$resource', '$log'];
  
  }());
  