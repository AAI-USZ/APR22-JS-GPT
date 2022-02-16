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
'b.js': mocks.fs.file(0, 'content'),
'a.txt': mocks.fs.file(0, 'some-text'),
'photo.png': mocks.fs.file(0, binarydata),
'CAM_PHOTO.JPG': mocks.fs.file(0, binarydata),
'proto.pb': mocks.fs.file(0, Buffer.from('mixed-content', 'utf8')),
'.dir': {
'a.js': mocks.fs.file(0, 'content')
}
}
})

const mocks_ = {
'graceful-fs': mockFs,
minimatch: require('minimatch')
}
