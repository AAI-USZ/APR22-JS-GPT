'use strict'

const Browser = require('../../lib/browser')
const BrowserCollection = require('../../lib/browser_collection')
const EventEmitter = require('../../lib/events').EventEmitter
const Executor = require('../../lib/executor')

describe('executor', () => {
let emitter
let capturedBrowsers
