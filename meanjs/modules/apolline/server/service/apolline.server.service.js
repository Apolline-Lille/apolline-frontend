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

//fonctionne une fois sur 2
//main function launch when we wrote "curl http://0.0.0.0:80/measurements/{database}"

//requête à passer en node
//"curl -G 'http://apolline.lille.inria.fr:8086/query?db=loa' --data-urlencode 'q=SELECT * FROM "pm.10.value"'"


exports.measurementsCampaignGET = async(campaign) => {

  var request = encodeURIComponent("SELECT * FROM \"pm.10.value\"");
  console.log(request);
  var options = {
    host: "apolline.lille.inria.fr",
    port: 8086,
    path: "/query?db="+campaign+"&q="+request,
    method: 'GET'
  };

  console.log(options);
  var req = await http.get(options, async (res) => {
    console.log(res);
    //console.log('STATUS:' + res.statusCode);
    //console.log('BODY:' + res.body);
    console.log(res.setEncoding("utf-8"));
    console.log(res.resume);
  });

  req.on('error', async (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  // write data to request body
  await req.write(req.body, function(err){
    req.end();
  });
}
