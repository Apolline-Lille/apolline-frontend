'use strict';

var utils = require('../utils/write.js'),
  path = require('path'),
  fs = require('fs'),
  url = require('url'),
  util = require('util'),
  ApollineCurl = require('../service/apolline-curl.server.service'),
  ApollineData = require('../service/apolline-getdata.server.service'),
  ApollineDelete = require('../service/apolline-delete.server.service'),
  ApollineExist = require('../service/apolline-exist.server.service'),
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
  ApollineData.getData(listRequest, stringTags, nameFile)
  .then(async function (response){
    console.log("response getData: " + response);
    res.send(response);
    //utils.writeCSV(res,response);
  })
  .catch(function (response){
    console.log(response);
    utils.writeCSV(res, response);
  });
};

exports.exist = function exist(req,res,next){
  var fileName = req.query.file;
  ApollineExist.exist(fileName).then(function (response) {
    console.log("response exist: " + response);
    res.send(response);
  }).catch(function (response){
    console.log(response);
    utils.writeCSV(res, response);
  });
}


exports.removeFile = function removeFile(req, res, next){
  var fileToRemove = req.query.file;
  console.log("fileToRemove " + fileToRemove);
  ApollineDelete.removeFile(fileToRemove)
    .then(function (response){
      console.log("file deleted: " + response);
    }).catch (function (response){
      console.error(response);
  });
}