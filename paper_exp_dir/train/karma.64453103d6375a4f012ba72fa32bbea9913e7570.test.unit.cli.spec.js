import cli from '../../lib/cli'
import optimist from 'optimist'
import path from 'path'
import constant from '../../lib/constants'
import mocks from 'mocks'
var loadFile = mocks.loadFile

describe('cli', () => {
var m
var e
var mockery

var fsMock = mocks.fs.create({
cwd: {'karma.conf.js': true},
cwd2: {'karma.conf.coffee': true},
cwd3: {'karma.conf.ts': true}
})

var currentCwd = null

var pathMock = {
resolve (p) {
return path.resolve(currentCwd, p)
}
}
