'use strict'

const Result = require('./browser_result')
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
this.lastResult = new Result()
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
this.collection.add(this)

this.bindSocketEvents(this.socket)

this.log.info('Connected on socket %s with id %s', this.socket.id, this.id)


this.emitter.emit('browsers_change', this.collection)

this.emitter.emit('browser_register', this)
}

isConnected () {
return this.state === CONNECTED
}

toString () {
return this.name
}

toJSON () {
return {
id: this.id,
fullName: this.fullName,
name: this.name,
state: this.state,
lastResult: this.lastResult,
disconnectsCount: this.disconnectsCount,
noActivityTimeout: this.noActivityTimeout,
disconnectDelay: this.disconnectDelay
}
}

onKarmaError (error) {
if (this.isConnected()) {
return
}

this.lastResult.error = true
this.emitter.emit('browser_error', this, error)

this.refreshNoActivityTimeout()
}

onInfo (info) {
if (this.isConnected()) {
return
}


if (helper.isDefined(info.dump)) {
this.emitter.emit('browser_log', this, info.dump, 'dump')
}

if (helper.isDefined(info.log)) {
this.emitter.emit('browser_log', this, info.log, info.type)
}

if (
!helper.isDefined(info.log) &&
!helper.isDefined(info.dump)
) {
this.emitter.emit('browser_info', this, info)
}

this.refreshNoActivityTimeout()
}

onStart (info) {
this.lastResult = new Result()
this.lastResult.total = info.total

this.state = EXECUTING

