var Schema = require('warehouse').Schema;
var moment = require('moment');
var pathFn = require('path');
var Promise = require('bluebird');
var Moment = require('./types/moment');

module.exports = function(ctx){
var Post = new Schema({
id: Number,
title: {type: String, default: ''},
date: {type: Moment, default: moment},
updated: {type: Moment, default: moment},
comments: {type: Boolean, default: true},
layout: {type: String, default: 'post'},
content: {type: String, default: ''},
excerpt: {type: String, default: ''},
