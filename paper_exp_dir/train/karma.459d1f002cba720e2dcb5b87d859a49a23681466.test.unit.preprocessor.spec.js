'use strict'

const mocks = require('mocks')
const di = require('di')
const path = require('path')

const events = require('../../lib/events')

describe('preprocessor', () => {
let m
let mockFs
let emitterSetting

const binarydata = new Buffer([0x25, 0x50, 0x44, 0x66, 0x46, 0x00])

beforeEach(() => {
mockFs = mocks.fs.create({
some: {
'a.js': mocks.fs.file(0, 'content'),
