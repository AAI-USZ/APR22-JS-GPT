'use strict';

var should = require('chai').should();
var Promise = require('bluebird');
var pathFn = require('path');
var fs = require('hexo-fs');
var testUtil = require('../../util');

describe('asset', function(){
var Hexo = require('../../../lib/hexo');
