
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
})

describe('.get()', function(){
it('should return undefined when unset', function(){
var app = express();
assert(undefined === app.get('foo'));
