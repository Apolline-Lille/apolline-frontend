'use strict';
var Influx = require('influx'); 
var jsonexport = require('jsonexport/dist');
var fs = require('fs');

var apiApolline = 'http://apolline.lille.inria.fr:8086/';

/**
 * Get all the data of the DataBase \"campaign\"
 * Return the whole database choosen \"campaign\" in a CSV file
 *
 * campaign String name of the database choosen
 * no response value expected for this operation
 **/

//port connexion: 'http://127.0.0.1:8088'
//pour localDB: NOAA_water_database
//measurements: 'average_temperature','h2o_feet','h2o_pH','h2o_quality','h2o_temperature'

var dataTable = new Array();
var listMeasurements = new Array();

//main function launch when we wrote "curl http://0.0.0.0:80/measurements/{database}"
exports.measurementsCampaignGET = async function(campaign) {
  console.log(apiApolline+campaign);
  return new Promise((resolve, reject) => {
    getAllMeasurements(campaign).then(function(measurements) {
      console.log("valeur de mesures " +measurements);
      return createMeasurementsTable(measurements);
    }).then(function(list) {
      list.forEach( measurement => {
        dataTable.push(getDataFromMeasurement(measurement, campaign));
      });
      console.log(dataTable);
      return dataTable;
    }).catch(err => {
      console.log("erreur catch inside return Promise");
      console.log(err);
      return reject();
    });
    resolve(dataTable);
  }).catch(err =>{
    console.log("erreur outside return Promise");
    console.log(err);
    return reject();
  });
}


//return all the measurements from the database choosen
async function getAllMeasurements(campaign){
  return new Promise((resolve, reject) => {
    const influxMeasurements = new Influx.InfluxDB(apiApolline + campaign);
    influxMeasurements.getMeasurements().then( results => {
      return resolve(results);
    }).catch(err => {
      console.log("erreur measurements");
      console.log(err);
      return reject();
    });
  });
}

async function createMeasurementsTable(measurements){
  return new Promise((resolve, reject) => {
    measurements.forEach(measurement => {
      listMeasurements.push(measurement);
    });
    return resolve(listMeasurements);
  }).catch(err => {
    console.log("erreur measurements");
    console.log(err);
    return reject();
  });  
}



//return the data from one measurement
function getDataFromMeasurement(measurement, campaign){
  return new Promise((resolve, reject) => {
    var request = "select * from \"" + measurement + "\" limit 10";
    const influxQuery = new Influx.InfluxDB(apiApolline + campaign);
    influxQuery.query(request).then(results => {
      return resolve(results);
    }).catch( err => {
        console.log("timeOut");
        console.log(err);
    });
  });
}


//add element to dataTable
function receiveCall(data){
  return new Promise((resolve, reject) => {
    console.log('entrée dans receiveCall');
    dataTable.push(data);
    console.log(dataTable);
    return resolve();
  });
}

//return the dataTable
function responseCall(arrayOfData){
  console.log("responceCall");
  console.log("\n \n");
  getCSV(arrayOfData);
}

//create the CSV file with the JSON DataTable
function getCSV(dataArray, callback){
  console.log("getCSV");
  jsonexport(dataArray,function(err, csv){
    if(err) {
      console.log("nul");
      return console.log(err);
    } 
    console.log("csv");
  });
}

function createFile(data){
  fs.writeFile('telechargement/formList.csv', data, 'utf8', function (err) {
    if (err) {
      console.log('Some error occured - file either not saved or corrupted file saved.');
    } else{
      console.log('It\'s saved!');
    }
  });
}

