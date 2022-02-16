
describe('plus', function () {
var breath = function () {
var finished = false
setTimeout(function () {
finished = true
}, 0)

waitsFor(function () {
return finished
})
}
