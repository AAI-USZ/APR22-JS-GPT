var mout = require('mout');
var Q = require('q');
var promptly = require('promptly');
var RegistryClient = require('bower-registry-client');
var PackageRepository = require('../core/PackageRepository');
var Logger = require('bower-logger');
var cli = require('../util/cli');
var createError = require('../util/createError');
var defaultConfig = require('../config');

