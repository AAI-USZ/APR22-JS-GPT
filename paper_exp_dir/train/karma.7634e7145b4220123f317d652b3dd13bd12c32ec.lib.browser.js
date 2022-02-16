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
this.name = helper.browserFullNameToShort(fullName)
this.state = CONNECTED
this.lastResult = new BrowserResult()
this.disconnectsCount = 0
this.activeSockets = [socket]
this.noActivityTimeout = noActivityTimeout
this.collection = collection
this.emitter = emitter
this.socket = socket
this.timer = timer
this.disconnectDelay = disconnectDelay

this.log = logger.create(this.name)

this.noActivityTimeoutId = null
this.pendingDisconnect = null
}

init () {
this.log.info(`Connected on socket ${this.socket.id} with id ${this.id}`)

this.bindSocketEvents(this.socket)
this.collection.add(this)
this.emitter.emit('browser_register', this)
}

onKarmaError (error) {
if (this.isNotConnected()) {
this.lastResult.error = true
this.emitter.emit('browser_error', this, error)
this.refreshNoActivityTimeout()
}
}

