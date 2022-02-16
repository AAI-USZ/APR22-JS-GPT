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
