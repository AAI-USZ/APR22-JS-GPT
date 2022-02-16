

"use strict";





const
path = require("path"),
util = require("util"),
lodash = require("lodash"),
configSchema = require("../../conf/config-schema"),
BuiltInEnvironments = require("../../conf/environments"),
BuiltInRules = require("../rules"),
ConfigOps = require("./config-ops");

const ajv = require("./ajv")();
const ruleValidators = new WeakMap();
const noop = Function.prototype;




let validateSchema;


const deprecationWarningMessages = {
ESLINT_LEGACY_ECMAFEATURES: "The 'ecmaFeatures' config file property is deprecated, and has no effect."
};
const severityMap = {
error: 2,
warn: 1,
off: 0
};

