function cleanConsole(args) {
return Promise.all([
deleteDatabase(this),
