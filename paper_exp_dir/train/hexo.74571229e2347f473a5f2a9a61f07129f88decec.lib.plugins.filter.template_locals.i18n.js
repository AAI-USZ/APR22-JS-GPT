'use strict';

var util = require('hexo-util');
var Pattern = util.Pattern;
var _ = require('lodash');

function i18nLocalsFilter(locals){

var i18n = this.theme.i18n;
var config = this.config;
