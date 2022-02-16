var request = mockRequest({ method: method.toUpperCase(), uri: { path: path }})
Express.server.callback(request, mockResponse())
return Express.response
