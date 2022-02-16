'use strict';

var models = require('../models');

module.exports = function(ctx){
var db = ctx.database;

var keys = Object.keys(models);
var key = '';

for (var i = 0, len = keys.length; i < len; i++){
