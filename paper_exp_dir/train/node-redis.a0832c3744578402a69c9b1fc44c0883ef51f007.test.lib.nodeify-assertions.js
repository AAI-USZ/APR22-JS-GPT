var assert = require("assert");
var path = require('path');
var RedisProcess = require("./lib/redis-process");
var rp;



if (!process.env.REDIS_TESTS_STARTED) {
process.env.REDIS_TESTS_STARTED = true;

