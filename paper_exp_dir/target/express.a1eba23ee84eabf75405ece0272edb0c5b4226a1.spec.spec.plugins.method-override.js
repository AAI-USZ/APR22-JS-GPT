post('/user', { body: '_method=put', headers: { 'content-type': 'application/x-www-form-urlencoded' }}).body.should.eql 'updated user'
post('/user', { body: '_method=PUT', headers: { 'content-type': 'application/x-www-form-urlencoded' }}).body.should.eql 'updated user'
