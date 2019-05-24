'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Apolline Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/measurements/:campaign',
      permissions: '*'
    },{
      resources: '/measurements/:campaign/data',
      permissions: '*'
    },{
      resources: '/exist',
      permissions: '*'
    },{
      resources: '/delete',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/measurements/:campaign',
      permissions: '*'
    },{
      resources: '/measurements/:campaign/data',
      permissions: '*'
    },{
      resources: '/exist',
      permissions: '*'
    },{
      resources: '/delete',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/measurements/:campaign',
      permissions: '*'
    },{
      resources: '/measurements/:campaign/data',
      permissions: '*'
    },{
      resources: '/exist',
      permissions: '*'
    },{
      resources: '/delete',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Apolline Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};