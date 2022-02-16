


function mockRequest(method, path, options) {
return {
method: method,
uri: {
full: path,
path: path,
queryString: '',
fragment: '',
params: {},
},
