
describe 'Express'
before_each
reset()
use(require('express/plugins/cookie').Cookie)
use(require('express/plugins/session').Session)
use(require('express/plugins/flash').Flash)
Session.store.clear()
var sess= new Base(123);
sess.same= true;
Session.store.commit(sess, function(){})
end

describe 'Flash'
describe '#flash()'
describe 'given a type and msg'
it 'should push a flash message'
var headers = { headers: { cookie: 'sid=123' }}
