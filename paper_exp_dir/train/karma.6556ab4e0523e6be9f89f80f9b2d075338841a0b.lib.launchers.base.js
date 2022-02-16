const KarmaEventEmitter = require('../events').EventEmitter
const EventEmitter = require('events').EventEmitter
const Promise = require('bluebird')

const log = require('../logger').create('launcher')
const helper = require('../helper')

const BEING_CAPTURED = 'BEING_CAPTURED'
const CAPTURED = 'CAPTURED'
const BEING_KILLED = 'BEING_KILLED'
const FINISHED = 'FINISHED'
const RESTARTING = 'RESTARTING'
const BEING_FORCE_KILLED = 'BEING_FORCE_KILLED'


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
this._state = null
Object.defineProperty(this, 'state', {
get: () => {
return this._state
