(function () {
    'use strict';
  
    angular
      .module('apolline.routes')
      .config(routeConfig);
  
    routeConfig.$inject = ['$stateProvider'];
  
    function routeConfig($stateProvider) {
      $stateProvider
        .state('apolline', {
          abstract: true,
          url: '/measurements',
          template: '<ui-view/>'
        })
        .state('apolline.view', {
          url:'',
          templateUrl: '/modules/apolline/client/views/apolline.component.html',
          controller: 'TableCtrl',
          controllerAs: 'vm'
        })
    }
  }());
  