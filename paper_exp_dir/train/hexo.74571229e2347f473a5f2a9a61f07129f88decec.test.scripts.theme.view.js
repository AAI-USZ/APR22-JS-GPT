'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var moment = require('moment');

describe('View', function(){
var Hexo = require('../../../lib/hexo');
