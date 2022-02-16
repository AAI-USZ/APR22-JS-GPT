return Express.router.params[key] ||
Express.server.request.uri.params[key]
}
