
describe('plus', function () {

function socket () {
return window.parent.karma.socket
}

it('should pass', function () {

console.log('============== START TEST ==============')
expect(1).toBe(1)
})

it('should disconnect', function (done) {
expect(2).toBe(2)
setTimeout(() => {
socket().disconnect()
done()
