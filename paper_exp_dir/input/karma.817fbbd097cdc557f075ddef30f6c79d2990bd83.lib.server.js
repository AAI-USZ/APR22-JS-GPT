'use strict'

const SocketIO = require('socket.io')
const di = require('di')
const util = require('util')
const Promise = require('bluebird')
const spawn = require('child_process').spawn
const tmp = require('tmp')
const fs = require('fs')
const path = require('path')

const BundleUtils = require('./utils/bundle-utils')
const NetUtils = require('./utils/net-utils')
const root = global || window || this

const cfg = require('./config')
const logger = require('./logger')
const constant = require('./constants')
const watcher = require('./watcher')
const plugin = require('./plugin')

const createServeFile = require('./web-server').createServeFile
const createServeStaticFile = require('./web-server').createServeStaticFile
const createFilesPromise = require('./web-server').createFilesPromise
const createReadFilePromise = require('./web-server').createReadFilePromise
const createWebServer = require('./web-server').createWebServer
const preprocessor = require('./preprocessor')
const Launcher = require('./launcher').Launcher
const FileList = require('./file-list')
const reporter = require('./reporter')
const helper = require('./helper')
const events = require('./events')
const KarmaEventEmitter = events.EventEmitter
const EventEmitter = require('events').EventEmitter
const Executor = require('./executor')
const Browser = require('./browser')
const BrowserCollection = require('./browser_collection')
const EmitterWrapper = require('./emitter_wrapper')
const processWrapper = new EmitterWrapper(process)

function createSocketIoServer (webServer, executor, config) {
const server = new SocketIO(webServer, {

destroyUpgrade: false,
path: config.urlRoot + 'socket.io/',
transports: config.transports,
