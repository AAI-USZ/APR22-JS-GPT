const path = require('path')
const _ = require('lodash')

const BaseLauncher = require('../../../lib/launchers/base')
const RetryLauncher = require('../../../lib/launchers/retry')
const CaptureTimeoutLauncher = require('../../../lib/launchers/capture_timeout')
const ProcessLauncher = require('../../../lib/launchers/process')
const EventEmitter = require('../../../lib/events').EventEmitter
const createMockTimer = require('../mocks/timer')
const logger = require('../../../lib/logger')

describe('launchers/process.js', () => {
let emitter
let mockSpawn
let mockTempDir
let launcher
let logErrorSpy
let logDebugSpy

