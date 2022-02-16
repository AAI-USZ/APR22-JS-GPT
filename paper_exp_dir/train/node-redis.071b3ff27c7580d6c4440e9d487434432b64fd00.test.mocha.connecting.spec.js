var async = require("async");
var config = require("../lib/config");
var nodeAssert = require("../lib/nodeify-assertions");
var redis = config.redis;
var RedisProcess = require("../lib/redis-process");
var uuid = require("uuid");

describe("A node_redis client", function () {

var rp;
before(function (done) {
RedisProcess.start(function (err, _rp) {
rp = _rp;
return done(err);
});
})

function allTests(parser, ip) {
var args = config.configureClient(parser, ip);

describe("using " + parser + " and " + ip, function () {
var client;

describe("when not connected", function () {
afterEach(function () {
client.end();
});

it("connects correctly", function (done) {
client = redis.createClient.apply(redis.createClient, args);
client.on("error", done);

client.once("ready", function () {
client.removeListener("error", done);
client.get("recon 1", function (err, res) {
done(err);
});
});
});
});

describe("when connected", function () {
var client;

beforeEach(function (done) {
client = redis.createClient.apply(redis.createClient, args);
client.once("error", function onError(err) {
done(err);
});
client.once("ready", function onReady() {
done();
});
});

afterEach(function () {
client.end();
});

describe("when redis closes unexpectedly", function () {
it("reconnects and can retrieve the pre-existing data", function (done) {
client.on("reconnecting", function on_recon(params) {
client.on("connect", function on_connect() {
async.parallel([function (cb) {
client.get("recon 1", function (err, res) {
nodeAssert.isString("one")(err, res);
cb();
});
}, function (cb) {
client.get("recon 1", function (err, res) {
nodeAssert.isString("one")(err, res);
cb();
});
}, function (cb) {
client.get("recon 2", function (err, res) {
nodeAssert.isString("two")(err, res);
cb();
});
}, function (cb) {
client.get("recon 2", function (err, res) {
nodeAssert.isString("two")(err, res);
cb();
});
}], function (err, results) {
client.removeListener("connect", on_connect);
client.removeListener("reconnecting", on_recon);
done(err);
});
});
});

client.set("recon 1", "one");
client.set("recon 2", "two", function (err, res) {


client.stream.destroy();
});
});

describe("and it's subscribed to a channel", function () {



xit("reconnects, unsubscribes, and can retrieve the pre-existing data", function (done) {
client.on("reconnecting", function on_recon(params) {
client.on("ready", function on_connect() {
async.parallel([function (cb) {
client.unsubscribe("recon channel", function (err, res) {
nodeAssert.isNotError()(err, res);
cb();
});
}, function (cb) {
client.get("recon 1", function (err, res) {
nodeAssert.isString("one")(err, res);
cb();
});
}], function (err, results) {
client.removeListener("connect", on_connect);
client.removeListener("reconnecting", on_recon);
done(err);
});
});
});

client.set("recon 1", "one");
client.subscribe("recon channel", function (err, res) {


client.stream.destroy();
});
});

it("remains subscribed", function () {
var client2 = redis.createClient.apply(redis.createClient, args);

client.on("reconnecting", function on_recon(params) {
client.on("ready", function on_connect() {
async.parallel([function (cb) {
client.on("message", function (channel, message) {
try {
nodeAssert.isString("recon channel")(null, channel);
nodeAssert.isString("a test message")(null, message);
} catch (err) {
cb(err);
}
});

client2.subscribe("recon channel", function (err, res) {
if (err) {
cb(err);
return;
}
client2.publish("recon channel", "a test message");
});
}], function (err, results) {
done(err);
});
});
});

client.subscribe("recon channel", function (err, res) {


client.stream.destroy();
});
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

after(function (done) {
if (rp) rp.stop(done);
})
});
