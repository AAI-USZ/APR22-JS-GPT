it('should not log if lower priority than browserConsoleLogOptions "error"', function () {
browserConsoleLogOptions: {level: 'error'}
reporter.onBrowserLog('Chrome', 'Message', 'WARN')
