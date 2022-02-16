var Cache = require('../../../lib/util/Cache');
var expect = require('expect.js');

describe('Cache', function() {
beforeEach(function() {
this.cache = new Cache();
});

describe('Constructor', function() {
describe('instantiating cache', function() {
it('should provide an instance of RegistryClient', function() {
expect(this.cache instanceof Cache).to.be.ok;
});

it('should inherit LRU cache methods', function() {
var self = this,
lruMethods = [
'max',
'lengthCalculator',
'length',
'itemCount',
