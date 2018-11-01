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

var nbCallback = 0;
var listMeasurements = new Array();
var dataTable = new Array();



exports.measurementsCampaignGET = function(campaign) {
  console.log('HELLOOOOOOOOOOOOOOOOO');
  getAllMeasurements(campaign, function(){
    getDataFromMeasurements(campaign);
  });

  return new Promise(function(resolve, reject) {
    resolve();
  });
}


function getAllMeasurements(campaign, callback){
  const influx = new Influx.InfluxDB(apiApolline+campaign);
  var measurements;
  influx.getMeasurements().then( results => {
    listMeasurements = results;
    callback();
  }).catch(err => {
    console.log(err);
  })
}

function getDataFromMeasurements(campaign){
  listMeasurements.forEach(function(measurement){
    getDataFromMeasurement(measurement, campaign);
  }); 
}

function getDataFromMeasurement(measurement,campaign){
  const influx = new Influx.InfluxDB(apiApolline+campaign);
  influx.query(`
    select * from "` + measurement + `"
     limit 10
     `)
    .then( results => {
      if (results != null) {
        console.log(results);
      }
      var value = results;
      receiveCall(value)
  }).catch(err => {
    console.log(err);
  });
}

//add element to dataTable
function receiveCall(results){
  dataTable.push(results);
  if (dataTable.length == listMeasurements.length){
    console.log("Nombre de mesure: " + dataTable.length);
    responseCall(dataTable);
  }
}

//return the dataTable
function responseCall(dataTable){
  console.log("responceCall");
  dataTable.forEach(function(value){
    console.log(JSON.stringify(value));
  });
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


