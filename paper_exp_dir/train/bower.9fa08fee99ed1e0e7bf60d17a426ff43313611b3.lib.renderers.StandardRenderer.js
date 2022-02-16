var cardinal = require('cardinal');
var chalk = require('chalk');
var path = require('path');
var mout = require('mout');
var archy = require('archy');
var Q = require('q');
var inquirer = require('inquirer');
var stringifyObject = require('stringify-object');
var os = require('os');
var pkg = require(path.join(__dirname, '../..', 'package.json'));
var template = require('../util/template');

function StandardRenderer(command, config) {
this._sizes = {
id: 13,
