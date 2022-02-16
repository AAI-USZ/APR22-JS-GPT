utilities.cookie('q')
response = get('foo', { headers : [['Cookie', 'path=/; q=something; domain=.example.net']] })
response.body.should.eql 'something'
