'use strict';

var _ = require('lodash');
var util = require('hexo-util');
var pathFn = require('path');
var Permalink = util.Permalink;
var permalink;

function postPermalinkFilter(data){

var config = this.config;
var meta = {
id: data.id || data._id,
title: data.slug,
