var Schema = require('warehouse').Schema;
var moment = require('moment');
var pathFn = require('path');
var Promise = require('bluebird');

var Moment = require('./types/moment');
var common = require('./common');

module.exports = function(ctx){
var swig = ctx.extend.tag.swig;

var Post = new Schema({
id: Number,
title: {type: String, default: ''},
