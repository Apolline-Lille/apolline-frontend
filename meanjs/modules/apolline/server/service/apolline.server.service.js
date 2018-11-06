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
var dataFromMeasurement = new Array();
var eltFromMeasurements = new Array();
var dataTable = new Array();




exports.measurementsCampaignGET = function(campaign) {
  getAllMeasurements(campaign, function(){
    console.log("entrée dans la sous fonction");
    getDataFromMeasurements(campaign, listMeasurements);
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

function getDataFromMeasurements(campaign, listMeasurements){
  listMeasurements.forEach(function(measurement){
    console.log(measurement);
    getDataFromMeasurement(measurement, campaign);
  });
}

function getDataFromMeasurement(measurement, campaign){
  const influxQuery = new Influx.InfluxDB(apiApolline+campaign);
  influxQuery.query(`
    select * from "` + measurement + `"
     limit 10
     `)
    .then( results => {
      dataFromMeasurement = results;
      receiveCall(dataFromMeasurement, function(){
        dataTable.push(dataFromMeasurement);
        console.log('rentrée dans le callback de receiveCall');
      });
  }).catch(err => {
    console.log(err);
  });
}

//add element to dataTable
function receiveCall(dataFromMeasurement, callback){
  eltFromMeasurements.push(dataFromMeasurement);
  callback();
}

//return the dataTable
function responseCall(dataTable){
  console.log("responceCall");
  dataTable.forEach(function(value){
    console.log("rentrée dans le forEach");
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


