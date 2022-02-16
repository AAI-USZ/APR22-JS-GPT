
var PORT = 6379;
var HOST = '127.0.0.1';
var parser = process.argv[3];

var redis = require("../index"),
client = redis.createClient(PORT, HOST, { parser: parser }),
client2 = redis.createClient(PORT, HOST, { parser: parser }),
client3 = redis.createClient(PORT, HOST, { parser: parser }),
bclient = redis.createClient(PORT, HOST, { return_buffers: true, parser: parser }),
assert = require("assert"),
crypto = require("crypto"),
util = require("../lib/util"),
