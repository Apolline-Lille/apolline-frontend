(function () {
  'use strict';

  angular
    .module('apolline.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.apolline', {
        abstract: true,
        url: '/measurements',
        template: '<ui-view/>'
      })
      .state('admin.apolline.view', {
        url:'',
        templateUrl: '/modules/apolline/client/views/apolline.component.html',
        controller: 'ApollineAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
  }
}());
