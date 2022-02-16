get('/user', { headers: { host: 'localhost' }}).body.should.eql 'localhost'
get('/user', { headers: { host: 'localhost' }}).body.should.eql 'localhost'
