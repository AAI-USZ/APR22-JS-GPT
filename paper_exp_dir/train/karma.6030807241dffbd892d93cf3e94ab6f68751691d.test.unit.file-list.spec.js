import Promise from 'bluebird'
import {EventEmitter} from 'events'
import mocks from 'mocks'
import proxyquire from 'proxyquire'
import pathLib from 'path'
var helper = require('../../lib/helper')
var _ = helper._

var from = require('core-js/library/fn/array/from')
var config = require('../../lib/config')


var patterns = (...strings) => strings.map(str => new config.Pattern(str))

function pathsFrom (files) {
