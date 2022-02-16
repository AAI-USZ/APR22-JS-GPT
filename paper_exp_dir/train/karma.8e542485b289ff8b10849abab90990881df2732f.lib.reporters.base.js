'use strict'

const util = require('util')

const constants = require('../constants')
const helper = require('../helper')

const BaseReporter = function (formatError, reportSlow, useColors, browserConsoleLogOptions, adapter) {
this.adapters = [adapter || process.stdout.write.bind(process.stdout)]

this.USE_COLORS = false
