function createCustomHandler (customFileHandlers, config) {
let warningDone = false
return function (request, response, next) {
