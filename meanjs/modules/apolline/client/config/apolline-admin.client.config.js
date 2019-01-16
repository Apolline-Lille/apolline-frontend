(function () {
    'use strict';
  
    // Configuring the Apolline Admin module
    angular
      .module('apolline.admin')
      .run(menuConfig);
  
    menuConfig.$inject = ['menuService'];
  
    function menuConfig(Menus) {
      Menus.addSubMenuItem('topbar', 'admin', {
        title: 'Generate CSV',
        state: 'admin.apolline'
      });
    }
  }());