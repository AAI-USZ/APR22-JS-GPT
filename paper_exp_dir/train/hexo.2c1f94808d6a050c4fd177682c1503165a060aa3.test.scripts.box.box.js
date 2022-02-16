'use strict';

var should = require('chai').should();
var assert = require('chai').assert;
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var crypto = require('crypto');
var util = require('hexo-util');
var Pattern = util.Pattern;
var testUtil = require('../../util');

function shasum(content){
