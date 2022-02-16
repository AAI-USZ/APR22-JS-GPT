


;(function(){



mockTimersVersion = '1.0.2'



var timers = []



setTimeout = function(callback, ms) {
var id
return id = setInterval(function(){
callback()
clearInterval(id)
}, ms)
}



setInterval = function(callback, ms) {
callback.step = ms, callback.current = callback.last = 0
return timers[timers.length] = callback, timers.length
}



clearInterval = clearTimeout = function(id) {
return delete timers[--id]
}



resetTimers = function() {
return timers = []
}



tick = function(ms) {
for (var i = 0, len = timers.length; i < len; ++i)
if (timers[i] && (timers[i].current += ms))
if (timers[i].current - timers[i].last >= timers[i].step) {
var times = Math.floor((timers[i].current - timers[i].last) / timers[i].step)
var remainder = (timers[i].current - timers[i].last) % timers[i].step
timers[i].last = timers[i].current - remainder
while (times-- && timers[i]) timers[i]()
}
}

})()
