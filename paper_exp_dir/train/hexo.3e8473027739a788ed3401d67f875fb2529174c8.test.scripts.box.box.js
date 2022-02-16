'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var crypto = require('crypto');
var util = require('hexo-util');
var sinon = require('sinon');
var Pattern = util.Pattern;
var testUtil = require('../../util');

function shasum(content){
var hash = crypto.createHash('sha1');
hash.update(content);
return hash.digest('hex');
}

