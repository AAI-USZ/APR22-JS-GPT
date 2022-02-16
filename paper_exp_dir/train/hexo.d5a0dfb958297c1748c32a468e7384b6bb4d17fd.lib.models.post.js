'use strict';

var Schema = require('warehouse').Schema;
var moment = require('moment');
var pathFn = require('path');
var Promise = require('bluebird');
var _ = require('lodash');
var Moment = require('./types/moment');

function pickID(data) {
return data._id;
}

module.exports = function(ctx) {
var Post = new Schema({
id: String,
title: {type: String, default: ''},
