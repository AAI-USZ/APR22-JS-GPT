
describe('plus', function () {

var socket = function () {
return window.parent.karma.socket
}

it('should pass', function () {
expect(1).toBe(1)
})

it('should disconnect', function (done) {
expect(2).toBe(2)
socket().disconnect()

done()
})

it('should work', function () {
expect(plus(1, 2)).toBe(3)
})

