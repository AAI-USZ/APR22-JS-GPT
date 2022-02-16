res.headers['set-cookie'][0].should.not.containEql('Thu, 01 Jan 1970 00:00:01 GMT');
.expect('Set-Cookie', /Max-Age=1/, done)
})
