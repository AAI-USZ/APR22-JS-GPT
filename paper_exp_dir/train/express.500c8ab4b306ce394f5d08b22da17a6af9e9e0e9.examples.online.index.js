






var express = require('../..')
, online = require('online')
, redis = require('redis')
, db = redis.createClient();



online = online(db);



var app = express();




