'use strict';

var Schema = require('warehouse').Schema;
var pathFn = require('path');
var Moment = require('./types/moment');
var moment = require('moment');

module.exports = function(ctx) {
var Page = new Schema({
title: {type: String, default: ''},
date: {
type: Moment,
default: moment,
language: ctx.config.languages,
timezone: ctx.config.timezone
},
