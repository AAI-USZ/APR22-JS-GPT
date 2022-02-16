var EventEmitter = require('events').EventEmitter;
var mout = require('mout');
var Q = require('q');
var RegistryClient = require('bower-registry-client');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function search(name, config) {
var registryClient;
var promise;
var emitter = new EventEmitter();

