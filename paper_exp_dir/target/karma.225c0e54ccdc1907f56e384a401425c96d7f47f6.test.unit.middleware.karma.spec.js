handler = createKarmaMiddleware(filesDeferred.promise, serveFile, null, '/base/path', '/__karma__/', clientConfig)
handler = createKarmaMiddleware(null, serveFile, null, '/base', '/')
handler = createKarmaMiddleware(null, serveFile, null, '/base', '/')
