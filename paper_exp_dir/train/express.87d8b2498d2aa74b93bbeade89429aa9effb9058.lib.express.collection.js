




$break = '__break__'



function callback(fn) {
return fn instanceof Function ? fn :
fn.length < 4 ?
Function('a, b, c', 'return a ' + fn + ' b') :
Function('a, b, c', 'return ' + fn)
}



Collection = Class({


