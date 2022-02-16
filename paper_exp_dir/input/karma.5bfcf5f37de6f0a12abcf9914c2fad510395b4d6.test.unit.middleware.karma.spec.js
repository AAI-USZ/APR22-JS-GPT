'use strict'

const mocks = require('mocks')

const helper = require('../../../lib/helper')
const constants = require('../../../lib/constants')
const File = require('../../../lib/file')
const Url = require('../../../lib/url')

const HttpResponseMock = mocks.http.ServerResponse
const HttpRequestMock = mocks.http.ServerRequest

describe('middleware.karma', () => {
let serveFile
let filesDeferred
let nextSpy
let response

class MockFile extends File {
constructor (path, sha, type, content) {
super(path, undefined, undefined, type)
this.sha = sha || 'sha-default'
this.content = content
}
}

const fsMock = mocks.fs.create({
karma: {
static: {
'client.html': mocks.fs.file(0, 'CLIENT HTML\n%X_UA_COMPATIBLE%%X_UA_COMPATIBLE_URL%'),
