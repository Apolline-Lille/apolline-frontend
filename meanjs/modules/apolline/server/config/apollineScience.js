'use strict';
//installation jsonexport to convert json in CSV
var utils = require('../controllers/apolline.server.config.js');
var ApollineScience = require('../../client/services/apolline.client.service.js');

module.exports.measurementsCampaignGET = function measurementsCampaignGET (req, res, next) {
  var campaign = req.swagger.params["campaign"].value;
  ApollineScience.measurementsCampaignGET(campaign)
    .then(function (response) {
      utils.writeCSV(res, response);
    })
    .catch(function (response) {
      utils.writeCSV(res, response);
    });
};
