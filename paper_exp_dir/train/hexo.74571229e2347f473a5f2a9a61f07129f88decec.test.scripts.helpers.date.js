'use strict';

var moment = require('moment');
var should = require('chai').should();

describe('date', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var dateHelper = require('../../../lib/plugins/helper/date');

