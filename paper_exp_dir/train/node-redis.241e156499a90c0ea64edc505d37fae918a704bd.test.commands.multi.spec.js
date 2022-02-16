'use strict';

var assert = require('assert');
var config = require("./lib/config");
var helper = require('./helper');
var redis = config.redis;
var zlib = require('zlib');
var uuid = require('uuid');
var client;

describe("The 'multi' method", function () {

afterEach(function () {
client.end();
});

