#!/usr/bin/env node


var fs = require('fs');
var util = require('util');
var path = require('path');


var MAX_LENGTH = 70;
var PATTERN = /^(\w*)(\(([\w\$\.\-\*]*)\))?\: (.*)$/;
var IGNORED = /^WIP\:/;
var TYPES = {
feat: true,
fix: true,
docs: true,
style: true,
