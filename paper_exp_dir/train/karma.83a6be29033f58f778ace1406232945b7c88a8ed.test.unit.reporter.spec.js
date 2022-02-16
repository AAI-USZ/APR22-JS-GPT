import {EventEmitter} from 'events'
import {loadFile} from 'mocks'
import path from 'path'
import _ from 'lodash'
import sinon from 'sinon'

import File from '../../lib/file'

describe('reporter', () => {
var m

beforeEach(() => {
m = loadFile(path.join(__dirname, '/../../lib/reporter.js'))
})

describe('formatError', () => {
var emitter
var formatError = emitter = null
var sandbox

beforeEach(() => {
emitter = new EventEmitter()
formatError = m.createErrorFormatter({ basePath: '', hostname: 'localhost', port: 8080 }, emitter)
sandbox = sinon.sandbox.create()
})

it('should call config.formatError if defined', () => {
var spy = sandbox.spy()
formatError = m.createErrorFormatter({ basePath: '', formatError: spy }, emitter)
formatError()

expect(spy).to.have.been.calledOnce
})

it('should not call config.formatError if not defined', () => {
var spy = sandbox.spy()
formatError()

expect(spy).not.to.have.been.calledOnce
})

it('should pass the error message as the first config.formatError argument', () => {
var ERROR = 'foo bar'
var spy = sandbox.spy()
formatError = m.createErrorFormatter({ basePath: '', formatError: spy }, emitter)
formatError(ERROR)

expect(spy.firstCall.args[0]).to.equal(ERROR)
})

it('should display the error returned by config.formatError', () => {
var formattedError = 'A new error'
formatError = m.createErrorFormatter({ basePath: '', formatError: () => formattedError }, emitter)

expect(formatError('Something', '\t')).to.equal(formattedError + '\n')
})

it('should indent', () => {
expect(formatError('Something', '\t')).to.equal('\tSomething\n')
})

it('should handle empty message', () => {
expect(formatError(null)).to.equal('\n')
})

it('should handle arbitrary error objects', () => {
expect(
formatError({hello: 'world'})
).to.equal(
JSON.stringify({hello: 'world'}) + '\n'
)
})

it('should handle error objects', () => {
expect(
formatError(new Error('fail'))
).to.equal(
'fail\n'
)
})

it('should remove specified hostname from files', () => {
expect(formatError('file http://localhost:8080/base/usr/a.js and http://127.0.0.1:8080/absolute/home/b.js')).to.be.equal('file usr/a.js and http://127.0.0.1:8080/home/b.js\n')
})

it('should remove shas', () => {
var ERROR = 'file http://localhost:8080/base/usr/file.js?6e31cb249ee5b32d91f37ea516ca0f84bddc5aa9 and http://127.0.0.1:8080/absolute/home/file.js?6e31cb249ee5b32d91f37ea516ca0f84bddc5aa9'
expect(formatError(ERROR)).to.be.equal('file usr/file.js and http://127.0.0.1:8080/home/file.js\n')
})

it('should indent all lines', () => {
expect(formatError('first\nsecond\nthird', '\t')).to.equal('\tfirst\n\tsecond\n\tthird\n')
})

it('should restore base paths', () => {
