import {loadFile} from 'mocks'
import constant from '../../lib/constants'

describe('runner', () => {
var m

beforeEach(() => {
m = loadFile(__dirname + '/../../lib/runner.js')
})

describe('parseExitCode', () => {
var EXIT = constant.EXIT_CODE

it('should return 0 exit code if present in the buffer', () => {
var result = m.parseExitCode(new Buffer(`something\nfake${EXIT}10`))
expect(result.exitCode).to.equal(0)
})

it('should remove the exit code part of the returned buffer', () => {
var buffer = new Buffer(`some${EXIT}01`)
var result = m.parseExitCode(buffer)

expect(buffer.toString()).to.equal(`some${EXIT}01`)
expect(result.buffer.toString()).to.equal('some')
