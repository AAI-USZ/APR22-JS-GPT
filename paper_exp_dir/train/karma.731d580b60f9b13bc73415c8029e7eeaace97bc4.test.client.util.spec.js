var chai = require('chai');
var expect = chai.expect

var util  = require('../../client/util');


describe('util', function() {

it('parseQueryParams', function() {
var params = util.parseQueryParams('?id=123&return_url=http://whatever.com');

