
var express = require('../')
, request = require('./support/http');

function req(ct) {
var req = {
headers: {
'content-type': ct,
'transfer-encoding': 'chunked'
},
__proto__: express.request
};

return req;
}

describe('req.is()', function(){
