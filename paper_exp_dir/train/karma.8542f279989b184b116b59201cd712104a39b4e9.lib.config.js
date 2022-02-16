'use strict'

const path = require('path')

const logger = require('./logger')
const log = logger.create('config')
const helper = require('./helper')
const constant = require('./constants')

const _ = require('lodash')

let COFFEE_SCRIPT_AVAILABLE = false
let LIVE_SCRIPT_AVAILABLE = false
let TYPE_SCRIPT_AVAILABLE = false

try {
require('coffeescript').register()
COFFEE_SCRIPT_AVAILABLE = true
} catch (e) {}



try {
require('LiveScript')
LIVE_SCRIPT_AVAILABLE = true
} catch (e) {}
