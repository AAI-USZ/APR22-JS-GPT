'use strict'

describe('BrowserResult', () => {
const Result = require('../../lib/browser_result')
let result = null

const successResultFromBrowser = {
success: true,
skipped: false,
time: 100
