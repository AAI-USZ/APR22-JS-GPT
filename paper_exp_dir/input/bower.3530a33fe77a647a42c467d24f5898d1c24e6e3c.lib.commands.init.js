var mout = require('mout');
var fs = require('graceful-fs');
var path = require('path');
var Q = require('q');
var inquirer = require('inquirer');
var Logger = require('bower-logger');
var endpointParser = require('bower-endpoint-parser');
var cli = require('../util/cli');
