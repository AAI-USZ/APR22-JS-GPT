
var assert = require('assert');
var express = require('..');

describe('config', function () {
describe('.set()', function () {
it('should set a value', function () {
var app = express();
app.set('foo', 'bar');
assert.equal(app.get('foo'), 'bar');
})

it('should return the app', function () {
