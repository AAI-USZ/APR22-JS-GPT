'use strict'

const Promise = require('bluebird')
const Jobs = require('qjobs')

const log = require('./logger').create('launcher')

const baseDecorator = require('./launchers/base').decoratorFactory
const captureTimeoutDecorator = require('./launchers/capture_timeout').decoratorFactory
const retryDecorator = require('./launchers/retry').decoratorFactory
