var async = require('async');
var assert = require('assert');
var config = require("../lib/config");
var helper = require('../helper');
var redis = config.redis;
var uuid = require('uuid');

describe("The 'flushdb' method", function () {

function allTests(parser, ip) {
var args = config.configureClient(parser, ip);

describe("using " + parser + " and " + ip, function () {
