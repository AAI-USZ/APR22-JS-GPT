

"use strict";





var rules = require("../rules"),
environments = require("../../conf/environments"),
schemaValidator = require("is-my-json-valid");

var validators = {
rules: Object.create(null)
};






function getRuleOptionsSchema(id) {
var rule = rules.get(id),
schema = rule && rule.schema;

if (!schema) {
