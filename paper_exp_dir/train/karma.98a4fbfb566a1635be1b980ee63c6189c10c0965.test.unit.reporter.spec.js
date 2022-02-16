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
