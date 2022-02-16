import {EventEmitter} from 'events'
import File from '../../lib/file'
import {loadFile} from 'mocks'
import path from 'path'
var _ = require('../../lib/helper')._

describe('reporter', () => {
var m

beforeEach(() => {
m = loadFile(path.join(__dirname, '/../../lib/reporter.js'))
})




