calculateExitCode (results, singleRunBrowserNotCaptured, config) {
config = config || {}
if (results.disconnected || singleRunBrowserNotCaptured) {
