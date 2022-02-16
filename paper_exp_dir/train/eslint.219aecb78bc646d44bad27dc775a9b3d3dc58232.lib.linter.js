

"use strict";





const
path = require("path"),
eslintScope = require("eslint-scope"),
evk = require("eslint-visitor-keys"),
espree = require("espree"),
lodash = require("lodash"),
BuiltInEnvironments = require("../../conf/environments"),
pkg = require("../../package.json"),
astUtils = require("../shared/ast-utils"),
ConfigOps = require("../shared/config-ops"),
