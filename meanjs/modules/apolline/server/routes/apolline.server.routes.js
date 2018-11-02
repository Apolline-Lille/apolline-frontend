'use strict';

/**
 * Module dependencies
 */
var campaign = require('../controllers/apolline.server.controller');

module.exports = function (app) {
  // Apolline collection routes
  app.route('/measurements/'+campaign).get(campaign.measurementsCampaignGET());

  // Finish by binding the apolline middleware
  app.param('campaign', campaign.measurementsCampaignGET());
};

