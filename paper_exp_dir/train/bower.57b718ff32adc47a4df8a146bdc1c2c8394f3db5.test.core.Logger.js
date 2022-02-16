var expect = require('expect.js');
var EventEmitter = require('events').EventEmitter;
var Logger = require('../../lib/core/Logger');

describe('Logger', function () {
var logger;

beforeEach(function () {
logger = new Logger();
});

describe('.constructor', function () {
it('should provide an instance of Logger', function () {
expect(logger instanceof Logger).to.be(true);
});

it('should provide an instance of EventEmitter', function () {
expect(logger instanceof EventEmitter).to.be(true);
});

it('should have prototype methods', function () {
var methods = [
