import _ from 'lodash'

import BaseLauncher from '../../../lib/launchers/base'
import RetryLauncher from '../../../lib/launchers/retry'
import {EventEmitter} from '../../../lib/events'

describe('launchers/retry.js', () => {
var emitter
var launcher

