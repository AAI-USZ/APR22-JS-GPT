
'use strict'

const mime = require('mime')
const _ = require('lodash')
const parseRange = require('range-parser')
const Buffer = require('safe-buffer').Buffer
const log = require('../logger').create('web-server')

function createServeFile (fs, directory, config) {
const cache = Object.create(null)

return function (filepath, rangeHeader, response, transform, content, doNotCache) {
let responseData

function convertForRangeRequest () {
const range = parseRange(responseData.length, rangeHeader)
if (range === -2) {
