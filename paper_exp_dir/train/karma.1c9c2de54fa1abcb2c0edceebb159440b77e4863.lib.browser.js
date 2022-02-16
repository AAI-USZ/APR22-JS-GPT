'use strict'

const BrowserResult = require('./browser_result')
const helper = require('./helper')
const logger = require('./logger')

const CONNECTED = 'CONNECTED'
const CONFIGURING = 'CONFIGURING'
const EXECUTING = 'EXECUTING'
const EXECUTING_DISCONNECTED = 'EXECUTING_DISCONNECTED'
const DISCONNECTED = 'DISCONNECTED'

class Browser {
constructor (id, fullName, collection, emitter, socket, timer, disconnectDelay,
noActivityTimeout, singleRun, clientConfig) {
this.id = id
this.fullName = fullName
this.name = helper.browserFullNameToShort(fullName)
this.lastResult = new BrowserResult()
this.disconnectsCount = 0
this.activeSockets = [socket]
this.noActivityTimeout = noActivityTimeout
this.singleRun = singleRun
