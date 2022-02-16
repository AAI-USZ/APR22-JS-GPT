
var express = require('../')
, request = require('./support/http');

function req(ct) {
var req = {
headers: { 'content-type': ct }
, __proto__: express.request
};

return req;
}

describe('req.is()', function(){
it('should ignore charset', function(){
req('application/json; charset=utf-8')
.is('json')
