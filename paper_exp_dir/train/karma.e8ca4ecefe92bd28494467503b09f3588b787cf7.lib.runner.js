'use strict'

const http = require('http')

const constant = require('./constants')
const helper = require('./helper')
const cfg = require('./config')
const logger = require('./logger')
const log = logger.create('runner')

function parseExitCode (buffer, defaultExitCode, failOnEmptyTestSuite) {
