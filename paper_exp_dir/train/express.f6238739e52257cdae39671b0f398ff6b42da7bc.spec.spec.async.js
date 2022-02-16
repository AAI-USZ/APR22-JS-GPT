
describe 'Express'
describe 'server'
before_each
Express.routes = []
end

describe 'callback'
it 'should wait for an asynchronous handler to finish'
require('jspec.timers')
get('pants', function() {
setTimeout(function() {
Express.server.finished('asynchronous thing done')
}, 50)
})
var response = get('pants')
response.body.should.be_null

