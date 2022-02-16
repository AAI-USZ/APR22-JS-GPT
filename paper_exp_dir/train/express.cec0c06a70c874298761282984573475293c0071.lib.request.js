


var accepts = require('accepts');
var typeis = require('type-is');
var http = require('http')
, utils = require('./utils')
, connect = require('connect')
, fresh = require('fresh')
, parseRange = require('range-parser')
, parse = connect.utils.parseUrl
, mime = connect.mime;


