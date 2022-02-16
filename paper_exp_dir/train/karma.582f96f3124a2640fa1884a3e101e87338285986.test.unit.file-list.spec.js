'use strict'

const Promise = require('bluebird')
const EventEmitter = require('events').EventEmitter
const mocks = require('mocks')
const proxyquire = require('proxyquire')
const pathLib = require('path')
const _ = require('lodash')

const helper = require('../../lib/helper')
