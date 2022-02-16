
var express = require('../')
, assert = require('assert');

describe('config', function(){
describe('.set()', function(){
it('should set a value', function(){
var app = express();
app.set('foo', 'bar').should.equal(app);
})

it('should return the app when undefined', function(){
var app = express();
app.set('foo', undefined).should.equal(app);
})

describe('"etag"', function(){
it('should throw on bad value', function(){
var app = express()
app.set.bind(app, 'etag', 42).should.throw(/unknown value/)
})

it('should set "etag fn"', function(){
var app = express()
var fn = function(){}
app.set('etag', fn)
app.get('etag fn').should.equal(fn)
})
})

describe('"trust proxy"', function(){
it('should set "trust proxy fn"', function(){
var app = express()
var fn = function(){}
app.set('trust proxy', fn)
app.get('trust proxy fn').should.equal(fn)
})
})
})
