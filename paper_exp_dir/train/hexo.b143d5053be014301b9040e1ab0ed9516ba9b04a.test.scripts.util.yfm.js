var yaml = require('yamljs'),
_ = require('lodash'),
moment = require('moment'),
should = require('chai').should();

describe('Util - yfm', function(){
var yfm = require('../../../lib/util/yfm');

describe('parse', function(){
it('only content', function(){
var str = [
'foo',
