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
clock = sinon.useFakeTimers(Date.now());
});

after(function(){
clock.restore();
});

it('date', function(){
var ctx = {
config: hexo.config,
page: {}
};

var date = dateHelper.date.bind(ctx);


date().should.eql(moment().format(hexo.config.date_format));


date(moment()).should.eql(moment().format(hexo.config.date_format));
date(moment(), 'MMM-D-YYYY').should.eql(moment().format('MMM-D-YYYY'));


date(new Date()).should.eql(moment().format(hexo.config.date_format));
date(new Date(), 'MMM-D-YYYY').should.eql(moment().format('MMM-D-YYYY'));


date(Date.now()).should.eql(moment().format(hexo.config.date_format));
date(Date.now(), 'MMM-D-YYYY').should.eql(moment().format('MMM-D-YYYY'));


ctx.page.lang = 'zh-tw';
date(Date.now(), 'MMM D YYYY').should.eql(moment().locale('zh-tw').format('MMM D YYYY'));
ctx.page.lang = '';


ctx.config.language = 'ja';
date(Date.now(), 'MMM D YYYY').should.eql(moment().locale('ja').format('MMM D YYYY'));
ctx.config.language = '';


ctx.config.timezone = 'UTC';
date(Date.now(), 'LLL').should.eql(moment().tz('UTC').format('LLL'));
ctx.config.timezone = '';
});

it('date_xml', function(){
var dateXML = dateHelper.date_xml;


dateXML().should.eql(moment().toISOString());


dateXML(moment()).should.eql(moment().toISOString());


dateXML(new Date()).should.eql(moment().toISOString());


dateXML(Date.now()).should.eql(moment().toISOString());
});

it('date_fromNow', function(){
var ctx = {
config: hexo.config,
page: {}
};

var dateFromNow = dateHelper.date_fromNow.bind(ctx);


dateFromNow().should.eql(moment().fromNow());


dateFromNow(moment()).should.eql(moment().fromNow());


dateFromNow(new Date()).should.eql(moment().fromNow());


dateFromNow(Date.now()).should.eql(moment().fromNow());
});
