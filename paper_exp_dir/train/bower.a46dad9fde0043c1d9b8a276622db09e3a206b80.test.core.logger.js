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
'intercept', 'pipe', 'geminate', 'log'
];

methods.forEach(function (method) {
expect(logger).to.have.property(method);
});
});
});

describe('events', function () {
var logData = {
foo: 'bar',
baz: 'string'
};

it('should pass through {}', function (done) {
logger.on('log', function (log) {
expect(log.data).to.eql({});
done();
