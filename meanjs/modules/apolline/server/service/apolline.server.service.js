'use strict';
var Influx = require('influx'); 
var jsonexport = require('jsonexport/dist');
var fs = require('fs');
var util = require('util');

var apiApolline = 'http://apolline.lille.inria.fr:8086/';
//'http://apolline.lille.inria.fr:8086/';

/**
 * Get all the data of the DataBase \"campaign\"
 * Return the whole database choosen \"campaign\" in a CSV file
 *
 * campaign String name of the database choosen
 * no response value expected for this operation
 **/

//port connexion: http://root:root@127.0.0.1:8086
//pour localDB: NOAA_water_database
//measurements: 'average_temperature','h2o_feet','h2o_pH','h2o_quality','h2o_temperature'

var dataTable = new Array();
var listMeasurements = new Array();

//main function launch when we wrote "curl http://0.0.0.0:80/measurements/{database}"
exports.measurementsCampaignGET = async (campaign) => {
  return new Promise(async (resolve,reject) =>{
    console.log("Lancement de getAllMeasurements");
    const influx = new Influx.InfluxDB(apiApolline);
    await influx.getMeasurements(campaign).then( async (measurements) => {
      return createMeasurementsTable(measurements);
    }).then (async (listMeasurements) => {
      const start = async () => {
        var i = 0;
        await asyncForEach(listMeasurements, async (measurement) => {
          avancement(i);
          await getDataFromMeasurement(measurement, campaign);
          i++;
        });
        return dataTable;
      }
      return start();
    }).then ( async (table) => {
      console.log("tu as tous les résultats");
      console.log(table.length);
      await jsonexport(table,function(err, csv){
        if(err) {
          console.log("nul");
          return console.log(err);
        }
        console.log("csv : \n" + csv );
        fs.writeFileSync("./CSVDownload/data" + Date.now() + ".csv", console.log(csv), "UTF-8");
        return csv;
      });
    }).then( async (value) => {
      console.log("ok");
      console.log(value);
    }).catch( async (err) => {
      console.log("erreur forEach async");
      console.log(err);
    });
    return resolve();
  }).catch( async (err) => {
    console.log("main err");
    console.log(err);
  });
}

const asyncForEach = async (array, callback) =>{
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
const avancement = async (i) =>{
  console.log(i);
}

const getDataFromMeasurement = async (measurement, campaign) => {
  var request = "select * from \"" + measurement + "\" limit 50";
  const influxQuery = new Influx.InfluxDB(apiApolline + campaign);
  return new Promise(async (resolve, reject) => {
    await influxQuery.query(request).then(async (results) => {
      dataTable.push(results);
    }).catch( err => {
      console.log(err);
    });
    return resolve(await dataTable);
  }).catch( async (err) => {
    console.log("erreur getDataFromMeasurements");
    console.log(err);
    reject();
  });
}


const createMeasurementsTable = async (measurements) =>{
  return new Promise(async (resolve, reject) =>{
    await measurements.forEach(async (measurement) =>{
      listMeasurements.push(measurement);
    });
    console.log("listMeasurements: " + listMeasurements);
    return resolve(await listMeasurements);
  }).catch( async (err) => {
    console.log("create table measurements");
    console.log(err);
    return reject();
  });  
}


//create the CSV file with the JSON DataTable
var getCSV = async (dataArray) =>{
  console.log("getCSV");
  jsonexport(dataArray,async (err, csv) =>{
    if(err) {
      console.log("nul");
      return console.log(err);
    } 
    console.log(csv);
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

