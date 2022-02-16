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

setState (toState) {
this.log.debug(`${this.state} -> ${toState}`)
this.state = toState
}

onKarmaError (error) {
if (this.isNotConnected()) {
this.lastResult.error = true
}
this.emitter.emit('browser_error', this, error)
this.refreshNoActivityTimeout()
}

onInfo (info) {
if (helper.isDefined(info.dump)) {
this.emitter.emit('browser_log', this, info.dump, 'dump')
}

if (helper.isDefined(info.log)) {
this.emitter.emit('browser_log', this, info.log, info.type)
} else if (!helper.isDefined(info.dump)) {
