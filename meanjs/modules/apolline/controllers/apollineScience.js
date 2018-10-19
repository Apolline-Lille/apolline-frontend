'use strict';

var utils = require('../utils/writer.js');
var ApollineScience = require('../service/ApollineScienceService');

module.exports.measurmentsCampaignGET = function measurmentsCampaignGET (req, res, next) {
  var campaign = req.swagger.params['campaign'].value;
  ApollineScience.measurmentsCampaignGET(campaign)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};