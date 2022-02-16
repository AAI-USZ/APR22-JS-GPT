
var request = require('supertest')
, app = require('../../examples/content-negotiation');

describe('content-negotiation', function(){
describe('GET /', function(){
it('should default to text/html', function(done){
request(app)
.get('/')
.expect(200, '<ul><li>Tobi</li><li>Loki</li><li>Jane</li></ul>', done)
})

it('should accept to text/plain', function(done){
request(app)
.get('/')
.set('Accept', 'text/plain')
.expect(200, ' - Tobi\n - Loki\n - Jane\n', done)
})

