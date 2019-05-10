'use strict';

/**
 * Module dependencies
 */
var apollinePolicy = require('../policies/apolline.server.policy'),
  path = require('path'),
  fs = require('fs'),
  campaign = require('../controllers/apolline.server.controller');

var spec = fs.readFileSync(path.join(__dirname,'../config/api/swagger.yaml'), 'utf8');


module.exports = function (app) {
  // Apolline collection routes
  app.route('/measurements/:campaign').all(apollinePolicy.isAllowed).get(campaign.measurementsCampaignGET);
  app.route('/measurements/:campaign/data').post(campaign.getData);
  app.route('/delete').all(apollinePolicy.isAllowed).get(campaign.removeFile);
};
