(function () {
    'use strict';
  
    angular
      .module('apolline')
      .run(menuConfig);

    menuConfig.$inject = ['menuService'];

    function menuConfig(menuService) {
    }
  }());