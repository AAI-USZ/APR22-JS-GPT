import _ from 'lodash'

import BaseLauncher from '../../../lib/launchers/base'
import {EventEmitter} from '../../../lib/events'

describe('launchers/base.js', () => {
var emitter
var launcher

beforeEach(() => {
