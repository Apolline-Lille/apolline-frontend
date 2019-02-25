(function (app) {
    'use strict';
  
    app.registerModule('apolline', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('apolline.admin', ['core.admin']);
    app.registerModule('apolline.admin.routes', ['core.admin.routes']);
    app.registerModule('apolline.services');
    app.registerModule('apolline.routes', ['ui.router', 'core.routes', 'apolline.services']);
  }(ApplicationConfiguration));