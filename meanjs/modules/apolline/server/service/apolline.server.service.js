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
var dataTable = new Array();



exports.measurementsCampaignGET = function(campaign) {
  console.log("entrée dans measurementsCampaignGET");
  getAllMeasurements(campaign, function(){
    console.log("entrée dans la sous fonction");
    getDataFromMeasurements(campaign, listMeasurements);
  });
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


function getAllMeasurements(campaign, callback){
  const influx = new Influx.InfluxDB(apiApolline+campaign);
  influx.getMeasurements().then( results => {
    listMeasurements = results;
    callback();
  }).catch(err => {
    console.log(err);
  })
}

function getDataFromMeasurements(campaign, listMeasurements){
  listMeasurements.forEach(function(measurement){
    console.log(measurement);
    getDataFromMeasurement(measurement, campaign, function(){
      console.log('entrée dans getDatafromMeasurements/getDataFromMeasurement');
      receiveCall(dataFromMeasurement);
    });
  }); 
}

function getDataFromMeasurement(measurement,campaign, callback){
  const influx = new Influx.InfluxDB(apiApolline+campaign);
  influx.query(`
    select * from "` + measurement + `"
     limit 10
     `)
    .then( results => {
      console.log("Hallelujah");
      dataFromMeasurement = results;
      callback();
  }).catch(err => {
    console.log(err);
  });
}

//add element to dataTable
function receiveCall(results){
  console.log('rentrée dans receivcall');
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


