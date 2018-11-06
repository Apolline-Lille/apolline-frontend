'use strict';

var utils = require('../utils/write.js'),
  path = require('path'),
  fs = require('fs'),
  ApollineScience = require('../service/apolline.server.service'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var spec = fs.readFileSync(path.join(__dirname,'../config/api/swagger.yaml'), 'utf8');

exports.measurementsCampaignGET = function measurementsCampaignGET (req, res, next) {
  var campaign = req.params.campaign;

  ApollineScience.measurementsCampaignGET(campaign)
    .then(function (response) {
      utils.writeCSV(res, response);
    })
    .catch(function (response) {
      utils.writeCSV(res, response);
    });
};