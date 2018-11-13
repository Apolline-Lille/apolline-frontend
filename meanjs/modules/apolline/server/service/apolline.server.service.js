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
  console.log("Lancement de getAllMeasurements");
  const influx = new Influx.InfluxDB(apiApolline + campaign);
  for (var i = 0; i < 10; i++) {
    test(influx, i);
  }

  /*
  const influx = new Influx.InfluxDB(apiApolline + campaign);
  return new Promise(async function(resolve, reject) {
    getAllMeasurements(influx).then(async function(measurements) {
      console.log(measurements);
      return createMeasurementsTable(await measurements);
    }).then(function(listMeasurements) {
      console.log(listMeasurements);
      return getDataFromMeasurements(influx,listMeasurements);
    }).then(async function(allData) {
      console.log(allData);
    }).catch(err => {
      console.log("erreur catch inside return Promise");
      console.log(err);
      return reject(err);
    });
    resolve(dataTable);
  }).catch(err =>{
    console.log("erreur outside return Promise");
    console.log(err);
    return reject();
  });*/
}

function test(influx, i) {
  influx.getMeasurements().then(measurements => {
    console.log("Numero " + i + " = OK");
  }).catch(err => {
    console.log("Numero " + i + " = KO FAILED");
  });  
}


//return all the measurements from the database choosen
async function getAllMeasurements(influx){
  return new Promise((resolve, reject) => {
    influx.getMeasurements().then(async function(results) {
      resolve(await results);
    }).catch(err => {
      console.log("erreur measurements");
      console.log(err);
      reject();
    });
  });
}

async function getDataFromMeasurements(influx, measurements){
  return new Promise(async function(resolve, reject){
    measurements.forEach(async function(measurement){
      var dataMeasurement = await getDataFromMeasurement(influx, measurement);
      dataTable.push(dataMeasurement);
    });
    resolve(await dataTable);
  }).catch(err => {
    console.log("error getDataFromMeasurements");
    reject(err);
  })
}

async function getDataFromMeasurement(influx, measurement){
  return new Promise(async function(resolve, reject){
    //await measurements.forEach(async function(measurement) {
    var request = "select * from \"" + measurement + "\" limit 1";
    await influx.query(request).then(async function(results) {
      resolve(await results);
    }).catch( err => {
        console.log("timeOut");
        console.log(err);
    });
  }).catch(err => {
    console.log("erreur getDataFromMeasurements");
    console.log(err);
    reject();
  });
}


async function createMeasurementsTable(measurements){
  return new Promise(async function(resolve, reject) {
    measurements.forEach(async function(measurement){
      listMeasurements.push(measurement);
    });
    console.log("listMeasurements: " + listMeasurements);
    return resolve(await listMeasurements);
  }).catch(err => {
    console.log("create table measurements");
    console.log(err);
    return reject();
  });  
}

async function createDataTable(datas){
  return new Promise((resolve, reject) => {
    datas.forEach(async function(data) {
      dataTable.push(await data);
    });
    return resolve(dataTable);
  }).catch(err => {
    console.log("erreur measurements");
    console.log(err);
    return reject();
  });  
}


//add element to dataTable
async function receiveCall(data){
  return new Promise((resolve, reject) => {
    console.log('entrée dans receiveCall');
    dataTable.push(data);
    console.log(dataTable);
    return resolve(dataTable);
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

