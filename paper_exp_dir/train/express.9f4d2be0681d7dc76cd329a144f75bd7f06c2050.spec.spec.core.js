
node = { http : {}}
node.http.STATUS_CODES = {
100 : 'Continue',
101 : 'Switching Protocols',
200 : 'OK',
201 : 'Created',
202 : 'Accepted',
203 : 'Non-Authoritative Information',
204 : 'No Content',
205 : 'Reset Content',
206 : 'Partial Content',
300 : 'Multiple Choices',
301 : 'Moved Permanently',
302 : 'Moved Temporarily',
303 : 'See Other',
304 : 'Not Modified',
305 : 'Use Proxy',
400 : 'Bad Request',
401 : 'Unauthorized',
402 : 'Payment Required',
403 : 'Forbidden',
404 : 'Not Found',
405 : 'Method Not Allowed',
406 : 'Not Acceptable',
407 : 'Proxy Authentication Required',
408 : 'Request Time-out',
409 : 'Conflict',
410 : 'Gone',
411 : 'Length Required',
412 : 'Precondition Failed',
413 : 'Request Entity Too Large',
414 : 'Request-URI Too Large',
415 : 'Unsupported Media Type',
500 : 'Internal Server Error',
501 : 'Not Implemented',
502 : 'Bad Gateway',
503 : 'Service Unavailable',
504 : 'Gateway Time-out',
505 : 'HTTP Version not supported'
}

describe 'Express'
describe '.version'
it 'should be properly formatted'
Express.version.should.match /\d+\.\d+\.\d+/
end
end

describe '.parseNestedParams()'
it 'should parse nested params hash provided by node'
params = { 'foo' : 'bar', 'user[name]' : 'tj', 'user[info][email]' : 'tj@vision-media.ca', 'user[info][city]' : 'Victoria' }
nested = Express.parseNestedParams(params)
nested.foo.should.eql 'bar'
nested.user.name.should.eql 'tj'
nested.user.info.email.should.eql 'tj@vision-media.ca'
nested.user.info.city.should.eql 'Victoria'
end
end

describe '.parseCookie()'
it 'should parse cookie pairs'
cookie = 'expires=Fri, 31-Dec-2010 23:59:59 GMT; path=/; q=foo%3dbar; domain=example.net'
parts = Express.parseCookie(cookie)
parts.expires.should.eql 'Fri, 31-Dec-2010 23:59:59 GMT'
parts.path.should.eql '/'
parts.q.should.eql 'foo=bar'
parts.domain.should.eql 'example.net'
end
end

describe '.cookie()'
before_each
cookie = 'expires=Fri, 31-Dec-2010 23:59:59 GMT; path=/; q=foo%3dbar; domain=example.net'
Express.request = {}
Express.request.cookie = Express.parseCookie(cookie)
end

it 'should return cookie value when key passed'
Express.cookie('path').should.eql '/'
Express.cookie('domain').should.eql 'example.net'
