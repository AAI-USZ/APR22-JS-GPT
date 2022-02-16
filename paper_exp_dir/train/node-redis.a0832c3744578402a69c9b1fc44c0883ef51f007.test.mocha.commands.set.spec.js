var async = require('async');
var assert = require('assert');
var config = require("../lib/config");
var helper = require('../helper');
var redis = config.redis;
var uuid = require('uuid');

describe("The 'set' method", function () {

function removeMochaListener () {
var mochaListener = process.listeners('uncaughtException').pop();
process.removeListener('uncaughtException', mochaListener);
return mochaListener;
