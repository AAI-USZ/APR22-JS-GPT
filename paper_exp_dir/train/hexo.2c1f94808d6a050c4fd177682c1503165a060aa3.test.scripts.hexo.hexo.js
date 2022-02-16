'use strict';

var should = require('chai').should();
var assert = require('chai').assert;
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var sinon = require('sinon');
var sep = pathFn.sep;
var testUtil = require('../../util');

describe('Hexo', function(){
var Hexo = require('../../../lib/hexo');
