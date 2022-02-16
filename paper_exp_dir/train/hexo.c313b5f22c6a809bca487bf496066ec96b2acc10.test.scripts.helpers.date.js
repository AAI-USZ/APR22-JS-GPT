'use strict';

var moment = require('moment-timezone');
var should = require('chai').should();
var sinon = require('sinon');

describe('date', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var dateHelper = require('../../../lib/plugins/helper/date');
var clock;

before(function(){
