import path from 'path'
import _ from 'lodash'

import BaseLauncher from '../../../lib/launchers/base'
import RetryLauncher from '../../../lib/launchers/retry'
import CaptureTimeoutLauncher from '../../../lib/launchers/capture_timeout'
import ProcessLauncher from '../../../lib/launchers/process'
import {EventEmitter} from '../../../lib/events'
import createMockTimer from '../mocks/timer'

describe('launchers/process.js', () => {
