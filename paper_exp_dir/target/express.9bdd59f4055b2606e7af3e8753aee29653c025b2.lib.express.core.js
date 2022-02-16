try {
Express.request = request
request.headers = Express.arrayToHash(request.headers)
