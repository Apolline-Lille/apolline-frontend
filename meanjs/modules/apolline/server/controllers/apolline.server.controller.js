'use strict';

var utils = require('../utils/write.js');
var ApollineScience = require('../service/apolline.server.service');

module.exports.measurementsCampaignGET = function measurementsCampaignGET (req, res, next) {
  var campaign = req.swagger.parameter['campaign'].value;
  ApollineScience.measurementsCampaignGET(campaign)
    .then(function (response) {
      utils.writeCSV(res, response);
    })
    .catch(function (response) {
      utils.writeCSV(res, response);
    });
};