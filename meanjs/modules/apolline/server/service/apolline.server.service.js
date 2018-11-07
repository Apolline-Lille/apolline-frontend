'use strict';
var http = require('http');
const Influx = require('influx'); 
var jsonexport = require('jsonexport/dist');
var fs = require('fs');

const apiApolline = 'http://apolline.lille.inria.fr:8086/';

/**
 * Get all the data of the DataBase \"campaign\"
 * Return the whole database choosen \"campaign\" in a CSV file
 *
 * campaign String name of the database choosen
 * no response value expected for this operation
 **/

var listMeasurements = new Array();
var data = new Array();
var dataTable = new Array();




exports.measurementsCampaignGET = function(campaign) {
  getAllMeasurements(campaign, function(){
    getDataFromMeasurements(campaign, listMeasurements, function(){
      responseCall(dataTable);
    });
  });
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


function getAllMeasurements(campaign, callback){
  const influxMeasurements = new Influx.InfluxDB(apiApolline+campaign);
  influxMeasurements.getMeasurements().then( results => {
    listMeasurements = results;
    callback();
  }).catch(err => {
    console.log(err);
  })
}

function getDataFromMeasurements(campaign, listMeasurements, callback){
  listMeasurements.forEach(function(measurement){
    getDataFromMeasurement(measurement, campaign, function(){
      callback();
    });
  });
}

function getDataFromMeasurement(measurement, campaign, callback){
  const influxQuery = new Influx.InfluxDB(apiApolline+campaign);
  influxQuery.query(`
    select * from "` + measurement + `"
    limit 10
  `).then( results => {
      data = results;
      receiveCall(JSON.stringify(data));
      callback();
  }).catch(err => {
    console.log("erreur de query");
    console.log(err);
  });
}

//add element to dataTable
function receiveCall(data){
  dataTable.push(data);
  console.log('receivCall');
}

//return the dataTable
function responseCall(dataTable){
  console.log("responceCall");
  console.log("\n \n");
  getCSV(dataTable);
}

//create the CSV file with the JSON DataTable
function getCSV(dataArray){
  console.log("getCSV");
  jsonexport(dataArray,function(err, csv){
    if(err) return console.log(err);
    console.log(csv);
  });
}


