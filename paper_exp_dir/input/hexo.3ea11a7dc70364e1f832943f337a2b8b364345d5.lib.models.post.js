var Schema = require('warehouse').Schema;
var moment = require('moment');
var pathFn = require('path');
var Promise = require('bluebird');

var Moment = require('./types/moment');

module.exports = function(ctx){
