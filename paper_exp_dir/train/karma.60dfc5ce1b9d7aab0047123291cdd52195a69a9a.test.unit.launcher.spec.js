var Promise = require('bluebird')
var di = require('di')

var events = require('../../lib/events')
var launcher = require('../../lib/launcher')
var createMockTimer = require('./mocks/timer')


var stubPromise = (obj, method, stubAction) => {
var promise = new Promise((resolve) => {
obj[method].resolve = resolve
