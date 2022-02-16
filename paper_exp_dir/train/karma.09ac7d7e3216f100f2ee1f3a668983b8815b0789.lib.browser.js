var helper = require('./helper')
var events = require('./events')
var logger = require('./logger')

var Result = require('./browser_result')


var READY = 1


var EXECUTING = 2


var READY_DISCONNECTED = 3


var EXECUTING_DISCONNECTED = 4


var DISCONNECTED = 5

var Browser = function (id, fullName,   collection, emitter, socket, timer,
disconnectDelay,
noActivityTimeout) {
var name = helper.browserFullNameToShort(fullName)
var log = logger.create(name)
var activeSockets = [socket]
var activeSocketsIds = function () {
return activeSockets.map(function (s) {
return s.id
}).join(', ')
}

var self = this
var pendingDisconnect
var disconnect = function (reason) {
self.state = DISCONNECTED
self.disconnectsCount++
log.warn('Disconnected (%d times)' + (reason || ''), self.disconnectsCount)
emitter.emit('browser_error', self, 'Disconnected' + reason)
collection.remove(self)
}

var noActivityTimeoutId
var refreshNoActivityTimeout = noActivityTimeout ? function () {
clearNoActivityTimeout()
noActivityTimeoutId = timer.setTimeout(function () {
self.lastResult.totalTimeEnd()
self.lastResult.disconnected = true
disconnect(', because no message in ' + noActivityTimeout + ' ms.')
emitter.emit('browser_complete', self)
}, noActivityTimeout)
} : function () {}

var clearNoActivityTimeout = noActivityTimeout ? function () {
if (noActivityTimeoutId) {
timer.clearTimeout(noActivityTimeoutId)
noActivityTimeoutId = null
}
} : function () {}

this.id = id
this.fullName = fullName
this.name = name
this.state = READY
this.lastResult = new Result()
this.disconnectsCount = 0

this.init = function () {
collection.add(this)

events.bindAll(this, socket)

log.info('Connected on socket %s with id %s', socket.id, id)


emitter.emit('browsers_change', collection)

emitter.emit('browser_register', this)
}

this.isReady = function () {
return this.state === READY
}

this.toString = function () {
return this.name
}

this.onKarmaError = function (error) {
if (this.isReady()) {
return
}

this.lastResult.error = true
emitter.emit('browser_error', this, error)

refreshNoActivityTimeout()
}

this.onInfo = function (info) {
if (this.isReady()) {
return
}


if (helper.isDefined(info.dump)) {
emitter.emit('browser_log', this, info.dump, 'dump')
}

if (helper.isDefined(info.log)) {
emitter.emit('browser_log', this, info.log, info.type)
}

if (
!helper.isDefined(info.log) &&
!helper.isDefined(info.dump)
) {
emitter.emit('browser_info', this, info)
}

refreshNoActivityTimeout()
}

this.onStart = function (info) {
