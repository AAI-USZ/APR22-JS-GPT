


describe('reporter', function () {
var loadFile = require('mocks').loadFile
var m = null

beforeEach(function () {
m = loadFile(__dirname + '/../../../lib/reporters/base.js')
return m
})

return describe('Progress', function () {
var reporter
var adapter = reporter = null

beforeEach(function () {
adapter = sinon.spy()
reporter = new m.BaseReporter(null, null, false, adapter)
return reporter
})

it('should write to all registered adapters', function () {
var anotherAdapter = sinon.spy()
reporter.adapters.push(anotherAdapter)

reporter.write('some')
expect(adapter).to.have.been.calledWith('some')
return expect(anotherAdapter).to.have.been.calledWith('some')
})

it('should omit adapters not using the right color', function () {
var anotherAdapter = sinon.spy()
anotherAdapter.colors = true
reporter.adapters.push(anotherAdapter)
reporter.write('some')
expect(adapter).to.have.been.calledWith('some')
return expect(anotherAdapter).to.not.have.been.called
})

it('should not call non-colored adapters when wrong default setting', function () {
