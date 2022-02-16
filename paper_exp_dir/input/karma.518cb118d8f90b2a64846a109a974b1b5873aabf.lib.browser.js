'use strict'

const Result = require('./browser_result')
const helper = require('./helper')
const logger = require('./logger')


const READY = 1


const EXECUTING = 2


const READY_DISCONNECTED = 3


const EXECUTING_DISCONNECTED = 4


const DISCONNECTED = 5

class Browser {
constructor (id, fullName, collection, emitter, socket, timer, disconnectDelay, noActivityTimeout) {
this.id = id
this.fullName = fullName
this.name = helper.browserFullNameToShort(fullName)
this.state = READY
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

isReady () {
return this.state === READY
}

toString () {
return this.name
}

