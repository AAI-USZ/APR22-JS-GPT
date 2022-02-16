import mocks from 'mocks'
import path from 'path'

describe('watcher', () => {
var config = require('../../lib/config')

var m = null

beforeEach(() => {
var mocks_ = {chokidar: mocks.chokidar}
m = mocks.loadFile(__dirname + '/../../lib/watcher.js', mocks_)
})

describe('baseDirFromPattern', () => {
