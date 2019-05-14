'use strict';

var fs = require('fs');

exports.removeFile = async (fileToRemove) => {
    var path = '/opt/meanjs/csvdownload';
    return new Promise(async (resolve, reject) => {
        await fs.unlinkSync(path + fileToRemove);
        return resolve();
    });
}