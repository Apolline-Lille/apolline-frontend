'use strict';

var utils = require('../utils/write.js'),
  path = require('path'),
  fs = require('fs'),
  url = require('url'),
  http = require('http'),
  ApollineCurl = require('../service/apolline-curl.server.service'),
  ApollineData = require('../service/apolline-getdata.server.service'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var spec = fs.readFileSync(path.join(__dirname,'../config/api/swagger.yaml'), 'utf8');

exports.measurementsCampaignGET = function measurementsCampaignGET (req, res, next) {
  var campaign = req.params.campaign;

  ApollineCurl.measurementsCampaignGET(campaign)
    .then(function (response) {
      utils.writeCSV(res, response);
    })
    .catch(function (response) {
      utils.writeCSV(res, response);
    });
};

exports.getData = function getData(req, res, next){
  var listRequest = req.body.params.listURL;
  var stringTags = req.body.params.tagString;
  var nameFile = req.body.params.fileName;
  var query = url.parse(req.url, true).query;
  console.log("nameFile " + nameFile);
  ApollineData.getData(listRequest, stringTags, nameFile)
    .then(function (response){
      //utils.writeCSV(res, response);
      console.log(response);
      var filePath = path.join('/opt/mean.js/modules/apolline/client/CSVDownload/', response);
      var stat = fs.statSync(filePath);
      res.set('Content-Type', 'application/gzip');
      res.set('Content-Length', stat.size);
      res.set('Content-Disposition', response);
      fs.chmodSync(filePath,'777', function (err) {
        console.log("Cant change access to the file: " + err);
      });
      console.log(res);
      res.send(filePath);
    })
    .catch(function (response){
      console.log(response);
      //utils.writeCSV(res, response);
    });
};