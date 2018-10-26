'use strict';
/**
 * Get all the data of the DataBase \"campaign\"
 * Return the whole database choosen \"campaign\" in a CSV file
 *
 * campaign String name of the database choosen
 * no response value expected for this operation
 **/
const Influx = require('influx'); 
var jsonexport = require('jsonexport');
const os = require('os')
var nbCallback = 0;
var listMeasurements = new Array();


exports.measurementsCampaignGET = function(campaign) {
  getAllMeasurements(campaign, function(){
    var dataTable = new Array();
    getDataFromMeasurements(campaign);
  });

  return new Promise(function(resolve, reject) {
    resolve();
  });
}


function getAllMeasurements(campaign, callback){
  const influx = new Influx.InfluxDB('http://apolline.lille.inria.fr:8086/'+campaign);
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
  const influx = new Influx.InfluxDB('http://apolline.lille.inria.fr:8086/'+campaign);
  influx.query(`
    select * from ` + Influx.escape.stringLit(measurement) + `
    where host = ${Influx.escape.stringLit(os.hostname())}
    order by time desc
    limit 10
    `).then( results => {
      console.log(results);
      //receiveCall(results)
  }).catch(err => {
    console.log(err);
  });
}

//add element to dataTable
function receiveCall(results){
  dataTable.push(results);
  if (dataTable.length == listMeasurements.length){
    console.log("Nombre de mesure ok");
  }
}


