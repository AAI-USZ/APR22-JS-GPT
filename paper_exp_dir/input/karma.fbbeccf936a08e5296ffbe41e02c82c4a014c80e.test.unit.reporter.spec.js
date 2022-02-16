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

