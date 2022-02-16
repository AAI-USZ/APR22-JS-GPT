const EventEmitter = require('events').EventEmitter
const request = require('supertest')
const di = require('di')
const mocks = require('mocks')
const fs = require('fs')
const mime = require('mime')
const path = require('path')

describe('web-server', () => {
let server
let emitter
const File = require('../../lib/file')

const _mocks = {}
const _globals = { __dirname: '/karma/lib' }

_mocks['graceful-fs'] = mocks.fs.create({
karma: {
static: {
'client.html': mocks.fs.file(0, 'CLIENT HTML')
}
},
base: {
path: {
'one.js': mocks.fs.file(0, 'js-source'),
'new.js': mocks.fs.file(0, 'new-js-source')
}
}
})



const m = mocks.loadFile(path.join(__dirname, '/../../lib/web-server.js'), _mocks, _globals)
server = emitter = null
let beforeMiddlewareActive = false
let middlewareActive = false
const servedFiles = (files) => {
emitter.emit('file_list_modified', { included: [], served: files })
}

describe('request', () => {
beforeEach(() => {
emitter = new EventEmitter()
const config = {
basePath: '/base/path',
urlRoot: '/',
beforeMiddleware: ['beforeCustom'],
middleware: ['custom'],
middlewareResponse: 'hello middleware!',
mime: { 'custom/custom': ['custom'] },
client: {
