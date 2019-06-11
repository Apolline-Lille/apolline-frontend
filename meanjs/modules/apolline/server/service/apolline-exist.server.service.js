'use strict';

var fs = require('fs');

exports.exist = async (fileName) => {
    var path = '/opt/mean.js/csvdownload/';
    var bool = false;
    return new Promise(async (resolve, reject) => {
        var pathToFile = path + fileName;
        fs.stat(pathToFile, function(err) {
            if(err == null) {
                bool = true;
                return resolve(bool);
            } else if(err.code === 'ENOENT') {
                // file does not exist
                return resolve(bool);
            } else {
                console.log('Some other error: ', err.code);
            }
        });
    });
}