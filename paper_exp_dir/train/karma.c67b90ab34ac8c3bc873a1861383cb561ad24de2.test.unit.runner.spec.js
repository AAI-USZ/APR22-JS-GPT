const loadFile = require('mocks').loadFile
const path = require('path')

const constant = require('../../lib/constants')

describe('runner', () => {
let m

beforeEach(() => {
m = loadFile(path.join(__dirname, '/../../lib/runner.js'))
})

describe('parseExitCode', () => {
const EXIT = constant.EXIT_CODE

it('should return 0 exit code if present in the buffer', () => {
const result = m.parseExitCode(new Buffer(`something\nfake${EXIT}10`))
expect(result.exitCode).to.equal(0)
})

it('should remove the exit code part of the returned buffer', () => {
const buffer = new Buffer(`some${EXIT}01`)
const result = m.parseExitCode(buffer)

expect(buffer.toString()).to.equal(`some${EXIT}01`)
expect(result.buffer.toString()).to.equal('some')
})

it('should not touch buffer without exit code and return default', () => {
const msg = 'some nice \n messgae {}'
const buffer = new Buffer(msg)
