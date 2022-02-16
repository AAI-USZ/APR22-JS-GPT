require('core-js')
import {EventEmitter} from 'events'
import request from 'supertest-as-promised'
import di from 'di'
import mocks from 'mocks'
import fs from 'fs'
import mime from 'mime'
import path from 'path'

describe('web-server', () => {
var server
var emitter
var File = require('../../lib/file')

var _mocks = {}
var _globals = {__dirname: '/karma/lib'}

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



var m = mocks.loadFile(path.join(__dirname, '/../../lib/web-server.js'), _mocks, _globals)
var customFileHandlers = server = emitter = null
var beforeMiddlewareActive = false
var middlewareActive = false
var servedFiles = (files) => {
emitter.emit('file_list_modified', {included: [], served: files})
}

describe('request', () => {
beforeEach(() => {
customFileHandlers = []
emitter = new EventEmitter()
var config = {
basePath: '/base/path',
urlRoot: '/',
beforeMiddleware: ['beforeCustom'],
middleware: ['custom'],
middlewareResponse: 'hello middleware!',
mime: {'custom/custom': ['custom']},
client: {
useIframe: true,
useSingleWindow: false
}
}

var injector = new di.Injector([{
config: ['value', config],
customFileHandlers: ['value', customFileHandlers],
