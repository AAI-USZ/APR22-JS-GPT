var moment = require('moment');
var should = require('chai').should();

describe('date', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var dateHelper = require('../../../lib/plugins/helper/date');

it('date', function(){
var ctx = {
config: hexo.config,
page: {}
};

var date = dateHelper.date.bind(ctx);


var now = moment();
date(now).should.eql(now.format(hexo.config.date_format));
