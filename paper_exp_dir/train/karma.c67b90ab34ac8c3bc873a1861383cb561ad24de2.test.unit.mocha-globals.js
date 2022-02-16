const sinon = require('sinon')
const chai = require('chai')
const logger = require('../../lib/logger')

require('bluebird').longStackTraces()


global.expect = chai.expect
global.should = chai.should()
global.sinon = sinon


chai.use(require('chai-as-promised'))
chai.use(require('sinon-chai'))
chai.use(require('chai-subset'))

beforeEach(() => {
global.sinon = sinon.sandbox.create()



logger.setup('INFO', false, [])
})

afterEach(() => {
global.sinon.restore()
})


chai.use((chai, utils) => {
chai.Assertion.addMethod('beServedAs', function (expectedStatus, expectedBody) {
const response = utils.flag(this, 'object')

this.assert(response._status === expectedStatus,
`expected response status '${response._status}' to be '${expectedStatus}'`)
this.assert(response._body === expectedBody,
`expected response body '${response._body}' to be '${expectedBody}'`)
})

chai.Assertion.addMethod('beNotServed', function () {
const response = utils.flag(this, 'object')

this.assert(response._status === null,
`expected response status to not be set, it was '${response._status}'`)
this.assert(response._body === null,
`expected response body to not be set, it was '${response._body}'`)
})
})


const nextTickQueue = []
const nextTickCallback = () => {
if (!nextTickQueue.length) throw new Error('Nothing scheduled!')
nextTickQueue.shift()()

if (nextTickQueue.length) process.nextTick(nextTickCallback)
}
global.scheduleNextTick = (action) => {
nextTickQueue.push(action)

if (nextTickQueue.length === 1) process.nextTick(nextTickCallback)
}
const nextQueue = []
const nextCallback = () => {

nextQueue.shift()()
}

global.scheduleNextTick = (action) => {
nextTickQueue.push(action)

if (nextTickQueue.length === 1) process.nextTick(nextTickCallback)
}
global.scheduleNext = (action) => {
nextQueue.push(action)
}

global.next = nextCallback

beforeEach(() => {
nextTickQueue.length = 0
nextQueue.length = 0
})
