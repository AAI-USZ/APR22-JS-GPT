






var express = require('../..')
, redis = require('redis')
, db = redis.createClient();



var app = express();

app.set('view engine', 'jade');
