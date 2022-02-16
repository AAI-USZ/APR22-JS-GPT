'use strict';

var assert = require('assert');
var config = require("./lib/config");
var helper = require('./helper');
var redis = config.redis;
var uuid = require('uuid');

describe("The 'batch' method", function () {

helper.allTests(function(parser, ip, args) {

describe("using " + parser + " and " + ip, function () {
var key, value;

beforeEach(function () {
key = uuid.v4();
value = uuid.v4();
});

describe("when not connected", function () {
var client;

beforeEach(function (done) {
client = redis.createClient.apply(redis.createClient, args);
client.once("connect", function () {
client.quit();
});
client.on('end', function () {
return done();
});
});

it("returns an empty array", function (done) {
var batch = client.batch();
batch.exec(function (err, res) {
assert.strictEqual(err, null);
assert.strictEqual(res.length, 0);
done();
});
});

it("returns an empty array if promisified", function () {
return client.batch().execAsync().then(function(res) {
assert.strictEqual(res.length, 0);
});
});
});

describe("when connected", function () {
var client;

beforeEach(function (done) {
client = redis.createClient.apply(redis.createClient, args);
client.once("ready", function () {
client.flushdb(function (err) {
return done(err);
});
});
});

afterEach(function () {
client.end();
});

it("returns an empty result array", function (done) {
var batch = client.batch();
var async = true;
var notBuffering = batch.exec(function (err, res) {
assert.strictEqual(err, null);
assert.strictEqual(res.length, 0);
async = false;
