const KarmaEventEmitter = require('../events').EventEmitter
const EventEmitter = require('events').EventEmitter
const Promise = require('bluebird')

const log = require('../logger').create('launcher')
const helper = require('../helper')

const BEING_CAPTURED = 1
const CAPTURED = 2
const BEING_KILLED = 3
const FINISHED = 4
const RESTARTING = 5
const BEING_FORCE_KILLED = 6


function BaseLauncher (id, emitter) {
if (this.start) {
return
}


Object.keys(EventEmitter.prototype).forEach(function (method) {
this[method] = EventEmitter.prototype[method]
}, this)

this.bind = KarmaEventEmitter.prototype.bind.bind(this)
this.emitAsync = KarmaEventEmitter.prototype.emitAsync.bind(this)

this.id = id
this.state = null
this.error = null

let killingPromise
let previousUrl

this.start = function (url) {
previousUrl = url

this.error = null
this.state = BEING_CAPTURED
this.emit('start', url + '?id=' + this.id + (helper.isDefined(this.displayName) ? '&displayName=' + encodeURIComponent(this.displayName) : ''))
}
