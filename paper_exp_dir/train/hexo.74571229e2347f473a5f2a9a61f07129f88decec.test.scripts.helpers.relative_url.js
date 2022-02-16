'use strict';

var should = require('chai').should();

describe('relative_url', function(){
var relativeURL = require('../../../lib/plugins/helper/relative_url');

it('from root', function(){
relativeURL('', 'foo/').should.eql('foo');
relativeURL('/', 'bar/').should.eql('bar');
});
