var moment = require('moment-timezone');
var should = require('chai').should();
var sinon = require('sinon');

describe('date', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var dateHelper = require('../../../lib/plugins/helper/date');
var clock;

