'use strict';

var influx = require('influent');
const Json2csvParser = require('json2csv').Parser;
var utils = require('../utils/writer.js');
var ApollineScience = require('../service/ApollineScienceService');

module.exports.measurmentsCampaignGET = function measurmentsCampaignGET (req, res, next) {
  var campaign = req.swagger.params['campaign'].value;
  ApollineScience.measurementsCampaignGET(campaign)
    .then(function (response) {
      utils.writeCSV(res, response);
    })
    .catch(function (response) {
      utils.writeCSV(res, response);
    });
};