config = { client: {}, basePath: '/' }
emitter.emit('run_complete', capturedBrowsers, { exitCode: 0 })
emitter.emit('run_complete', capturedBrowsers, { exitCode: 0, success: 0, failed: 0 })
