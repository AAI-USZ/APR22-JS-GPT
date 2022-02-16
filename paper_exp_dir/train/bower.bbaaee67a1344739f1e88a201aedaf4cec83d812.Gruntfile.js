'use strict';

var tmp = require('tmp');
var childProcess = require('child_process');
var arraydiff = require('arr-diff');
var fs = require('fs');
var wrench = require('wrench');
var inquirer = require('inquirer');
var path = require('path');

module.exports = function (grunt) {
require('load-grunt-tasks')(grunt);

