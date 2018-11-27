'use strict';

var jsonexport = require('jsonexport/dist');
var fs = require('fs');
var http = require('http');
var express = require('express');

var apiApolline = "apolline.lille.inria.fr:8086/";
//'http://apolline.lille.inria.fr:8086/';

/**
 * Get all the dat
 * 
 * 
 * a of the DataBase \"campaign\"
 * Return the whole database choosen \"campaign\" in a CSV file
 *
 * campaign String name of the database choosen
 * no response value expected for this operation
 **/

//port connexion: http://root:root@localhost:8086/
//pour localDB: NOAA_water_database
//measurements: 'average_temperature','h2o_feet','h2o_pH','h2o_quality','h2o_temperature'

var dataTable = new Array();
var listMeasurements = new Array();
var dataMeasurements = new Array();

//fonctionne une fois sur 2
//main function launch when we wrote "curl http://0.0.0.0:80/measurements/{database}"

//requête à passer en node
//"curl -G 'http://apolline.lille.inria.fr:8086/query?db=loa' --data-urlencode 'q=SELECT * FROM "pm.10.value"'"


exports.measurementsCampaignGET = async(campaign) => {

  var request = encodeURIComponent("SELECT * FROM \"pm.10.value\"");
  var options = {
    host: "apolline.lille.inria.fr",
    port: 8086,
    path: "/query?db="+campaign+"&q="+request,
    method: 'GET'
  };

  var url = "http://" + options.host + ":" + options.port + options.path;
  console.log(url);

  http.get(url, (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => {
      console.log("chunk");
      console.log(chunk);
      rawData += chunk; 
    });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        console.log("ici");
        console.log(parsedData);
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}
