'use strict'

const c = require('../../lib/completion')

describe('completion', () => {
let completion

function mockEnv (line) {
const words = line.split(' ')

return {
