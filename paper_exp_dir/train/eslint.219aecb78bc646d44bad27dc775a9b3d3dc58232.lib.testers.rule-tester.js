
"use strict";









const
assert = require("assert"),
path = require("path"),
util = require("util"),
lodash = require("lodash"),
{ getRuleOptionsSchema, validate } = require("../shared/config-validator"),
{ Linter, SourceCodeFixer, interpolate } = require("../linter");

const ajv = require("../shared/ajv")({ strictDefaults: true });






const testerDefaultConfig = { rules: {} };
let defaultConfig = { rules: {} };


const RuleTesterParameters = [
