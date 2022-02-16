const StateMachine = require('../../../lib/init/state_machine')

describe('init/StateMachine', () => {
let done
let machine

const mockRli = {
close: () => null,
write: () => null,
prompt: () => null,
_deleteLineLeft: () => null,
_deleteLineRight: () => null
}

const mockColors = {
question: () => ''
}

beforeEach(() => {
machine = new StateMachine(mockRli, mockColors)
done = sinon.spy()
})

it('should go through all the questions', () => {
const questions = [
{id: 'framework', options: ['jasmine', 'mocha']},
{id: 'other'}
]

done = sinon.spy((answers) => {
expect(answers.framework).to.equal('jasmine')
expect(answers.other).to.equal('abc')
})

machine.process(questions, done)
machine.onLine('jasmine')
machine.onLine('abc')
expect(done).to.have.been.called
})

it('should allow multiple answers', () => {
const questions = [
{id: 'browsers', multiple: true}
]

done = sinon.spy((answers) => {
expect(answers.browsers).to.deep.equal(['Chrome', 'Safari'])
})

machine.process(questions, done)
machine.onLine('Chrome')
machine.onLine('Safari')
machine.onLine('')
expect(done).to.have.been.called
})

it('should treat spaces as confirmation of multiple answers', () => {
const questions = [
{id: 'browsers', multiple: true}
]

done = sinon.spy((answers) => {
expect(answers.browsers).to.deep.equal(['Chrome'])
})

machine.process(questions, done)
machine.onLine('Chrome')
machine.onLine(' ')
expect(done).to.have.been.called
})

it('should always return array for multiple', () => {
const questions = [
{id: 'empty', multiple: true}
]

done = sinon.spy((answers) => {
expect(answers.empty).to.deep.equal([])
})

machine.process(questions, done)
machine.onLine('')
expect(done).to.have.been.called
})

it('should validate answers', () => {
const validator = sinon.spy()
