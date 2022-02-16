









var express = require('../..');
var online = require('online');
var redis = require('redis');
var db = redis.createClient();



online = online(db);



var app = express();
