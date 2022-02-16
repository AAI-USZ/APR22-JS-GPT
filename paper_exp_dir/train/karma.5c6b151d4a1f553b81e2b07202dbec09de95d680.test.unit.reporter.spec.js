import {EventEmitter} from 'events'
import {loadFile} from 'mocks'
import path from 'path'
import _ from 'lodash'

import File from '../../lib/file'

describe('reporter', () => {
var m

beforeEach(() => {
