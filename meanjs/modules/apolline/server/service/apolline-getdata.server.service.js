

'use strict';

var jsonexport = require('jsonexport/dist');
var fs = require('fs');
var http = require('http');



exports.getData = async(listURL, tagsCSV, nameFile) => {
    var file = "/opt/mean.js/modules/apolline/server/CSVDownload/" + nameFile;
    var stream = fs.createWriteStream(file);
    await stream.write(tagsCSV + "\n");
    return new Promise(async (resolve, reject) => {
        await asyncForEach(listURL, async(urlMeasurement) => {
            console.log(urlMeasurement);
            await getDataFromMeasurement(urlMeasurement);
        });
        await stream.end();
        console.log("namefile: " + nameFile);
        console.log("namefile toString: " + nameFile.toString());
        return resolve(nameFile);
    });
}
const getDataFromMeasurement = async (url) => {
  return new Promise((resolve, reject) => {
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
                console.log("measurement: " + parsedData.results[0].series[0].name);
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
                    stream.write(dataLine + "\n");
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