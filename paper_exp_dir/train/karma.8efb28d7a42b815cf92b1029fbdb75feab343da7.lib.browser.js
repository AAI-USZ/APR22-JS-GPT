'use strict'

const BrowserResult = require('./browser_result')
const helper = require('./helper')
const logger = require('./logger')

const CONNECTED = 1
const CONFIGURING = 2
const EXECUTING = 3
const EXECUTING_DISCONNECTED = 4
const DISCONNECTED = 5

class Browser {
constructor (id, fullName, collection, emitter, socket, timer, disconnectDelay, noActivityTimeout) {
this.id = id
this.fullName = fullName
