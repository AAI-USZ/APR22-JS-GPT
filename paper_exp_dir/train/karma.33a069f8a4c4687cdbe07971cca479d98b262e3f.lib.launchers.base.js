const KarmaEventEmitter = require('../events').EventEmitter
const EventEmitter = require('events').EventEmitter

const log = require('../logger').create('launcher')
const helper = require('../helper')

const BEING_CAPTURED = 'BEING_CAPTURED'
const CAPTURED = 'CAPTURED'
const BEING_KILLED = 'BEING_KILLED'
const FINISHED = 'FINISHED'
const RESTARTING = 'RESTARTING'
const BEING_FORCE_KILLED = 'BEING_FORCE_KILLED'
