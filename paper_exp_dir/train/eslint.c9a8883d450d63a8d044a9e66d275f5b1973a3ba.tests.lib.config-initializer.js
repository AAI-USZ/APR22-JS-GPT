

"use strict";





var assert = require("chai").assert,
init = require("../../../lib/config/config-initializer");





var answers = {};

describe("configInitializer", function() {
beforeEach(function() {
answers = {
extendDefault: true,
