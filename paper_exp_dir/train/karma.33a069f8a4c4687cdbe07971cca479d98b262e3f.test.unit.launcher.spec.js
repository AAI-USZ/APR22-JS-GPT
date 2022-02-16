'use strict'

const di = require('di')

const events = require('../../lib/events')
const launcher = require('../../lib/launcher')
const createMockTimer = require('./mocks/timer')


const stubPromise = (obj, method, stubAction) => {
const promise = new Promise((resolve) => {
obj[method].resolve = resolve
})
