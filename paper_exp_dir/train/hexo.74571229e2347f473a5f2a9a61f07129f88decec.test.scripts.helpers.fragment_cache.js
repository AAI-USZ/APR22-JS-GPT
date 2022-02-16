'use strict';

var should = require('chai').should();

describe('fragment_cache', function(){
var fragment_cache = require('../../../lib/plugins/helper/fragment_cache')();

fragment_cache.call({cache: true}, 'foo', function(){
return 123;
});

