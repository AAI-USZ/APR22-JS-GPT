'use strict'

const Browser = require('../../lib/browser')
const BrowserCollection = require('../../lib/browser_collection')
const EventEmitter = require('../../lib/events').EventEmitter
const Executor = require('../../lib/executor')

const log = require('../../lib/logger').create()

describe('executor', () => {
let emitter
let capturedBrowsers
let config
let spy
let executor

beforeEach(() => {
