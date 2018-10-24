'use strict';
//installation jsonexport to convert json in CSV
var utils = require('../utils/writer.js');
var ApollineScience = require('../service/ApollineScienceService');

module.exports.measurementsCampaignGET = function measurementsCampaignGET (req, res, next) {
  var campaign = req.swagger.params['campaign'].value;
  ApollineScience.measurementsCampaignGET(campaign)
    .then(function (response) {
      utils.writeCSV(res, response);
    })
    .catch(function (response) {
      utils.writeCSV(res, response);
    });
};
