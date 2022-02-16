'use strict';

var childProcess = require('child_process');
var arraydiff = require('arr-diff');
var fs = require('fs');
var inquirer = require('inquirer');

module.exports = function (grunt) {
require('load-grunt-tasks')(grunt);

grunt.initConfig({
