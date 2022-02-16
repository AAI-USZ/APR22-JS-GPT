Express.request.headers = { 'accept' : 'text/plain' }
Express.header('accept').should.eql 'text/plain'
end
