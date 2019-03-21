
'use strict';

var jsonexport = require('jsonexport/dist');
var fs = require('fs');
var http = require('http');
var zlib = require('zlib');
/**
 * Get all the data
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


var dataMeasurement = new Array();
var dataCSV = "";

//fonctionne une fois sur 2
//main function launch when we wrote "curl http://0.0.0.0:80/measurements/{database}"

//requête à passer en node
//"curl -G 'http://apolline.lille.inria.fr:8086/query?db=loa' --data-urlencode 'q=SELECT * FROM "pm.10.value"'"


//The file will be generate inside CSVDownload
exports.measurementsCampaignGET = async(campaign) => {
  var listMeasurements = new Array();
  var nameColumns = new Array();

  //set the name of the file and it path
  var start = new Date().getTime();
  console.log("début " + start);
  var nameFile = "data" + start + ".csv";
  var path = "/opt/mean.js/modules/apolline/client/CSVDownload/";
  var stream = fs.createWriteStream("/opt/mean.js/modules/apolline/client/CSVDownload/" + nameFile);

  return new Promise(async (resolve, reject) => {
    console.log("Début fonction");

    //get the measurement of the database "campaign"
    await getMeasurements(campaign, listMeasurements).then( async () => {
      console.log(listMeasurements);

      //write the tags of the variable in the file
      await getColumnsName(listMeasurements[0][0], campaign, nameColumns).then( async() => {
        var columnString = "";
        for(var i = 0 ; i < nameColumns.length; i++){
          if (i != ((nameColumns.length)-1)){
            columnString = columnString + nameColumns[i] + ",";
          }
          else {
            columnString = columnString + nameColumns[i] + "\n";
          }
        }
        console.log(nameColumns);
        stream.write(columnString);
        await asyncForEach(listMeasurements, async(measurement) => {
          await getDataFromMeasurement(measurement, campaign, stream);
        });
        await stream.on("finish", async function() {
          await console.log("file uploaded");
          await stream.end();  
        });
        
        const fileContents = fs.createReadStream(path + nameFile);
        const writeStream = fs.createWriteStream(path + nameFile + '.gz');
        const zip = zlib.createGzip();
        console.log("ici");
        await fileContents.pipe(zip).pipe(writeStream).on('finish', (err) => {
            if (err) return reject(err);
            else resolve();
        });
        await fs.unlinkSync(path + nameFile);
        var finalName = nameFile + '.gz';
        return resolve(finalName);     
      });
    })/*.then(async () => {s
      await console.log(dataTable[1]);
      await dataTable.splice(0,0,nameColumns);
      var end = new Date().getTime();
      console.log("end " + end);
      console.log("durée du programme: " + Math.abs(end - start)/60000);
      await jsonexport(dataTable,function(err, csv){
        if(err) {
          console.log("nul");
          return console.log(err);
        }
        console.log("csv : \n" + csv );
        dataCSV = csv;
        return csv;
      });
      resolve(dataCSV);
    }).then(async() => {
      var dateCreation = new Date().getTime();
      var nameFile = "data" + dateCreation + ".csv";
      await fs.writeFileSync(__dirname + "/CSVDownload/" + nameFile.toString(), dataCSV, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
    })*/.catch ( async (err) => {
      console.log(err);
      reject(err);
    });   
  });
}

const getMeasurements = async (campaign, listMeasurements) => {
  return new Promise((resolve, reject) => {
    var request = encodeURIComponent("SHOW MEASUREMENTS");
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
        rawData += chunk;
      });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          parsedData["results"][0]["series"][0]["values"].forEach((measurement) => {
            listMeasurements.push(measurement);
          });
          console.log("dans getMeasurements: "+listMeasurements);
          resolve(listMeasurements);
        } catch (e) {
          console.error(e.message);
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  });
}

const getColumnsName = async (measurement, campaign, nameColumns) => {
  return new Promise((resolve, reject) => {
    var request = encodeURIComponent("SHOW TAG KEYS FROM \"" + measurement + "\"");
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
        rawData += chunk;
      });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          nameColumns.push(parsedData["results"][0]["series"][0]["values"]);
          resolve(nameColumns);
        } catch (e) {
          console.error(e.message);
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  });
}

const getDataFromMeasurement = async (measurement, campaign, stream) => {
  return new Promise((resolve, reject) => {
    var request = encodeURIComponent("SELECT * FROM \"" + measurement + "\" LIMIT 5");
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
        rawData += chunk;
      });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          (parsedData.results[0].series[0].values).forEach(async (data) => {
            var dataLine="";
            for (var i = 0; i < data.length; i++){
                if (i != ((data.length)-1)){
                    dataLine = dataLine + data[i] + ",";
                }
                else {
                    dataLine = dataLine + data[i];
                }
            }
            await stream.write(dataLine + "\n");
            await stream.write("");

        });
        resolve();
        } catch (e) {
          console.error(e.message);
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  });
}

const asyncForEach = async (array, callback) =>{
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}