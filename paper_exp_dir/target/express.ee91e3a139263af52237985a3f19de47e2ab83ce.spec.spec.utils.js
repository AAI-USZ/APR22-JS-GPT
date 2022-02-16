utils.mergeParam('user[names][firstName]', 'tj', params)
params.user.names.firstName.should.eql 'tj'
