'use strict';

var _ = require('lodash');
var util = require('hexo-util');
var Permalink = util.Permalink;
var permalink;

function postPermalinkFilter(data){

var config = this.config;
