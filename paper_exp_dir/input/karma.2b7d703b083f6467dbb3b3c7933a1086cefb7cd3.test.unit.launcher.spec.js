import Promise from 'bluebird'
import di from 'di'
import events from '../../lib/events'
import launcher from '../../lib/launcher'
import createMockTimer from './mocks/timer'


var stubPromise = (obj, method, stubAction) => {
var promise = new Promise((resolve) => {
obj[method].resolve = resolve
})

sinon.stub(obj, method, () => {
if (stubAction) stubAction()

return promise
})
}

class FakeBrowser {
constructor (id, name, baseBrowserDecorator) {
this.id = id
this.name = name
