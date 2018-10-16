'use strict';

/**
 * Module dependencies.
 */
var app = require('./config/lib/app');

//parameter of the server
var hostname = 'localhost';
var port = '80';

var server = app.start();
