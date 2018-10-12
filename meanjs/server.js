'use strict';

/**
 * Module dependencies.
 */
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
var app = require('./config/lib/app');

//manage the database connexion
const Influx = require('influx')

const client = new Influx.InfluxDB({
  database: 'loa',
  host: 'apolline.lille.inria.fr',
  port: 8086,
  schema: [
    {
      measurement: 'humidity',
      fields: {
        device: Influx.FieldType.STRING,
        geohash: Influx.FieldType.STRING,
        provider: Influx.FieldType.STRING,
        transport: Influx.FieldType.STRING,
        unit: Influx.FieldType.STRING,
        uuid: Influx.FieldType.STRING,
      },
      measurement: 'humidity.compensated',
      fields: {
        device: Influx.FieldType.STRING,
        geohash: Influx.FieldType.STRING,
        provider: Influx.FieldType.STRING,
        transport: Influx.FieldType.STRING,
        unit: Influx.FieldType.STRING,
        uuid: Influx.FieldType.STRING,
      },
      measurement: 'pm.0.3.above',
      fields: {
        device: Influx.FieldType.STRING,
        geohash: Influx.FieldType.STRING,
        provider: Influx.FieldType.STRING,
        transport: Influx.FieldType.STRING,
        unit: Influx.FieldType.STRING,
        uuid: Influx.FieldType.STRING,
      },
      measurement: 'pm.0.5.above',
      fields: {
        device: Influx.FieldType.STRING,
        provider:Influx.FieldType.STRING,
        transport:Influx.FieldType.STRING,
        unit:Influx.FieldType.STRING,
        uuid:Influx.FieldType.STRING,
      },
      measurement: 'pm.01.value',
      fields: {
        device:Influx.FieldType.STRING,
        geohash:Influx.FieldType.STRING,
        provider:Influx.FieldType.STRING,
        transport:Influx.FieldType.STRING,
        unit:Influx.FieldType.STRING,
        uuid:Influx.FieldType.STRING,
      },
      measurement: 'pm.0_3.above',
      fields: {
        device:Influx.FieldType.STRING,
        geohash:Influx.FieldType.STRING,
        provider:Influx.FieldType.STRING,
        transport:Influx.FieldType.STRING,
        unit:Influx.FieldType.STRING,
        uuid:Influx.FieldType.STRING,
      },
      measurement: 'pm.0_5.above',
      fields: {
        device:Influx.FieldType.STRING,
        geohash:Influx.FieldType.STRING,
        provider:Influx.FieldType.STRING,
        transport:Influx.FieldType.STRING,
        unit:Influx.FieldType.STRING,
        uuid:Influx.FieldType.STRING,
      },
      //
      measurement: 'pm.1.above',
      fields: {
        device:Influx.FieldType.STRING,
        geohash:Influx.FieldType.STRING,
        provider:Influx.FieldType.STRING,
        transport:Influx.FieldType.STRING,
        unit:Influx.FieldType.STRING,
        uuid:Influx.FieldType.STRING,
      },
      measurement: 'pm.10.above',
      fields: {
        device:Influx.FieldType.STRING,
        geohash:Influx.FieldType.STRING,
        provider:Influx.FieldType.STRING,
        transport:Influx.FieldType.STRING,
        unit:Influx.FieldType.STRING,
        uuid:Influx.FieldType.STRING,
      },
      measurement: 'pm.10.value',
      fields: {
        device:Influx.FieldType.STRING,
        geohash:Influx.FieldType.STRING,
        provider:Influx.FieldType.STRING,
        transport:Influx.FieldType.STRING,
        unit:Influx.FieldType.STRING,
        uuid:Influx.FieldType.STRING,
      },
      measurement: 'pm.2.5.above',
      fields: {
        device:Influx.FieldType.STRING,
        geohash:Influx.FieldType.STRING,
        provider:Influx.FieldType.STRING,
        transport:Influx.FieldType.STRING,
        unit:Influx.FieldType.STRING,
        uuid:Influx.FieldType.STRING,
      },
      measurement: 'pm.2.5.value',
      fields: {
        device:Influx.FieldType.STRING,
        geohash:Influx.FieldType.STRING,
        provider:Influx.FieldType.STRING,
        transport:Influx.FieldType.STRING,
        unit:Influx.FieldType.STRING,
        uuid:Influx.FieldType.STRING,
      },
      measurement: 'pm.2_5.above',
      fields: {
        device:Influx.FieldType.STRING,
        geohash:Influx.FieldType.STRING,
        provider:Influx.FieldType.STRING,
        transport:Influx.FieldType.STRING,
        unit:Influx.FieldType.STRING,
        uuid:Influx.FieldType.STRING,
      },
      measurement: 'pm.2_5.value',
      fields: {
        device:Influx.FieldType.STRING,
        geohash:Influx.FieldType.STRING,
        provider:Influx.FieldType.STRING,
        transport:Influx.FieldType.STRING,
        unit:Influx.FieldType.STRING,
        uuid:Influx.FieldType.STRING,
      },
      measurement: 'pm.5.above',
      fields: {
        device:Influx.FieldType.STRING,
        geohash:Influx.FieldType.STRING,
        provider:Influx.FieldType.STRING,
        transport:Influx.FieldType.STRING,
        unit:Influx.FieldType.STRING,
        uuid:Influx.FieldType.STRING,
      },
      measurement: 'temperature',
      fields: {
        device:Influx.FieldType.STRING,
        geohash:Influx.FieldType.STRING,
        provider:Influx.FieldType.STRING,
        transport:Influx.FieldType.STRING,
        unit:Influx.FieldType.STRING,
        uuid:Influx.FieldType.STRING,
      },
      measurement: 'temperature.c',
      fields: {
        device:Influx.FieldType.STRING,
        geohash:Influx.FieldType.STRING,
        provider:Influx.FieldType.STRING,
        transport:Influx.FieldType.STRING,
        unit:Influx.FieldType.STRING,
        uuid:Influx.FieldType.STRING,
      },
      measurement: 'temperature.k',
      fields: {
        device:Influx.FieldType.STRING,
        geohash:Influx.FieldType.STRING,
        provider:Influx.FieldType.STRING,
        transport:Influx.FieldType.STRING,
        unit:Influx.FieldType.STRING,
        uuid:Influx.FieldType.STRING,
      },
      tags: [
        'inria'
      ]
    }
  ]
});


var server = app.start();
