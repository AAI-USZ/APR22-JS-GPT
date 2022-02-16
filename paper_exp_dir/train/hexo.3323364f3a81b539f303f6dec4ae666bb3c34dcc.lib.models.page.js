var Schema = require('warehouse').Schema;
var pathFn = require('path');
var Moment = require('./types/moment');
var moment = require('moment');

module.exports = function(ctx){
var Page = new Schema({
title: {type: String, default: ''},
date: {type: Moment, default: moment},
updated: {type: Moment, default: moment},
comments: {type: Boolean, default: true},
layout: {type: String, default: 'page'},
content: {type: String, default: ''},
excerpt: {type: String, default: ''},
source: {type: String, required: true},
