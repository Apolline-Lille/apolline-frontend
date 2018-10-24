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
  const influx = new Influx.InfluxDB('http://apolline.lille.inria.fr:8086/'+campaign);
  console.log(influx);
  /*influx.query('select * from humidity').then( result => {
    console.log(result)
  })*/
  console.log("new request");
  console.log("\n");
  influx.getSeries({
    measurement: "humidity",
    database: campaign
  }).then(names => {
    console.log('My series names in my_measurement are: ' + names.join(', '))
  }).catch(function(names){
    console.log("first catch");
    console.log(names);
  });
  
  /*influx.getSeries()
    .then(names => {
      console.log("names = "+names);
      console.log("data = "+data);
      names.then(function(result){
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
