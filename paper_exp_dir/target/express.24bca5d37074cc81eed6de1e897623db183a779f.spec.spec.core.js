describe '.escapeRegexp()'
it 'should escape regexp special characters'
Express.escapeRegexp('/users/(name)').should.eql '\\/users\\/\\(name\\)'
