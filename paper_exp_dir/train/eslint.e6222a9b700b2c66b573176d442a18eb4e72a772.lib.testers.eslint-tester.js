
"use strict";









var assert = require("assert"),
util = require("util"),
merge = require("lodash.merge"),
omit = require("lodash.omit"),
clone = require("lodash.clonedeep"),
validator = require("../config-validator"),
validate = require("is-my-json-valid"),
eslint = require("../eslint"),
metaSchema = require("../../conf/json-schema-schema.json");






var testerDefaultConfig = { rules: {} };
var defaultConfig = { rules: {} };


var RuleTesterParameters = [
"code",
"filename",
"options",
"args",
"errors"
];

var validateSchema = validate(metaSchema, { verbose: true });






function RuleTester(testerConfig) {


this.testerConfig = merge(
