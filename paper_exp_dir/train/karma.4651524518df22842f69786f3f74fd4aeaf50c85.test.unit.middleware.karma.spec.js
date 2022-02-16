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
let readFilesDeferred
let filesDeferred
let nextSpy
let response

class MockFile extends File {
constructor (path, sha, type) {
super(path, undefined, undefined, type)
this.sha = sha || 'sha-default'
}
}
