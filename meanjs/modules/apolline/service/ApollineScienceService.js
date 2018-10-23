'use strict';


/**
 * Get all the data of the DataBase \"campaign\"
 * Return the whole database choosen \"campaign\" in a CSV file
 *
 * campaign String name of the database choosen
 * no response value expected for this operation
 **/
exports.measurementsCampaignGET = function(campaign) {
  const Influx = require('influx'); 
  var jsonexport = require('jsonexport');
  console.log("campaign = "+ campaign);
  var influx = new Influx.InfluxDB('http://apolline.lille.inria.fr:8086/'+campaign);
  console.log(influx);
  influx.getSeries().then(names => {
    console.log('My series names in my_measurement are: ' + names.join(', '))
  });
  
  /*influx.getSeries()
    .then(names => {
      console.log("names = "+names);
      console.log("data = "+data);
      data.then(function(result){
        jsonexport(result, function(err, csv){
          if(err) return console.log(err);
          console.log(csv);
        });
      });
    })
    .catch(function(response){
      console.log("it's ok!");
      console.log(response);
    });*/
  
  
  return new Promise(function(resolve, reject) {
    resolve();
  });
}
