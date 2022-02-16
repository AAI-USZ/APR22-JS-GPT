var async = require('async');
var assert = require('assert');
var config = require("../lib/config");
var helper = require('../helper');
var redis = config.redis;
var uuid = require('uuid');

describe("The 'dbsize' method", function () {

    function allTests(parser, ip) {
        var args = config.configureClient(parser, ip);

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
                    client.once("error", done);
                    client.once("connect", function () {
                        client.quit();
                    });
                    client.on('end', function () {
                        return done();
                    });
                });

                it("reports an error", function (done) {
                    client.dbsize([], function (err, res) {
                        assert.equal(err.message, 'Redis connection gone from end event.');
                        done();
                    });
                });
            });

            describe("when connected", function () {
                var client;

                beforeEach(function (done) {
                    client = redis.createClient.apply(redis.createClient, args);
                    client.once("error", done);
                    client.once("connect", function () {
                        client.flushdb(function (err, res) {
                            helper.isString("OK")(err, res);
                            done();
                        });
                    });
                });

                afterEach(function () {
                    client.end();
                });

                it("returns a zero db size", function (done) {
                    client.dbsize([], function (err, res) {
                        helper.isNotError()(err, res);
                        helper.isType.number()(err, res);
                        assert.strictEqual(res, 0, "Initial db size should be 0");
                        done();
                    });
                });

                describe("when more data is added to Redis", function () {
                    var oldSize;

                    beforeEach(function (done) {
                        client.dbsize([], function (err, res) {
                            helper.isType.number()(err, res);
                            assert.strictEqual(res, 0, "Initial db size should be 0");

                            oldSize = res;

                            client.set(key, value, function (err, res) {
                                helper.isNotError()(err, res);
                                done();
                            });
                        });
                    });

                    it("returns a larger db size", function (done) {
                        client.dbsize([], function (err, res) {
                            helper.isNotError()(err, res);
                            helper.isType.positiveNumber()(err, res);
                            assert.strictEqual(true, (oldSize < res), "Adding data should increase db size.");
                            done();
                        });
                    });
                });
            });
        });
    }

    ['javascript', 'hiredis'].forEach(function (parser) {
        allTests(parser, "/tmp/redis.sock");
        ['IPv4', 'IPv6'].forEach(function (ip) {
            allTests(parser, ip);
        })
    });
});
