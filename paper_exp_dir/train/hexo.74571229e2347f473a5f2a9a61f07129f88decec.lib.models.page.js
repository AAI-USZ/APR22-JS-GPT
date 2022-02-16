'use strict';

var Schema = require('warehouse').Schema;
var pathFn = require('path');
var Moment = require('./types/moment');
var moment = require('moment');
var CacheString = require('./types/cachestring');

module.exports = function(ctx){
var Page = new Schema({
