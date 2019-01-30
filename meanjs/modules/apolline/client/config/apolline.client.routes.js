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
          url: '/measurements/:campaign',
          template: '<ui-view/>'
        })
        .state('apolline.measurements', {
          url:'',
          templateUrl: '/modules/apolline/client/views/apolline.component.html',
          controller: 'MeasurementController',
          controllerAs: 'vm',
          data: {
            pageTitle: "Choose Measurements"
          }
        })
        .state('apolline.tag', {
          url: '/tags',
          templateUrl: '/modules/apolline/client/views/apolline-tag.component.html',
          controller: 'TagsController',
          controllerAs: 'vm',
          data: {
            pageTitle: "Choose Tags"
          }
        })
    }
  }());
  