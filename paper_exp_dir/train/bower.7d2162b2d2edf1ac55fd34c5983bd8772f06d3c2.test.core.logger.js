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

it('should pass through {}', function (next) {
logger.on('log', function (log) {
expect(log.data).to.eql({});
next();
});
logger.info();
});

it('should pass through logData', function (next) {
logger.on('log', function (log) {
expect(log.data).to.eql(logData);
next();
});
logger.info('foo', 'message', logData);
});

it('should emit error event', function (next) {
logger.on('log', function (log) {
expect(log.level).to.eql('error');
expect(log.id).to.eql('foo');
expect(log.message).to.eql('error message');
expect(log.data).to.eql({});
next();
});
logger.error('foo', 'error message');
});

it('should emit conflict event', function (next) {
logger.on('log', function (log) {
expect(log.level).to.eql('conflict');
expect(log.id).to.eql('foo');
expect(log.message).to.eql('conflict message');
expect(log.data).to.eql({});
next();
});
logger.conflict('foo', 'conflict message');
});

it('should emit warn event', function (next) {
logger.on('log', function (log) {
expect(log.level).to.eql('warn');
expect(log.id).to.eql('foo');
expect(log.message).to.eql('warn message');
expect(log.data).to.eql({});
next();
