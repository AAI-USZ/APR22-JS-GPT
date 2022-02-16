request.cookie = Express.parseCookie(request.headers['Cookie'])
request.uri.params = Express.parseNestedParams(request.uri.params)
request.uri.path = Express.normalizePath(request.uri.path)
