module.exports = function(command, argv){
require('./config')(process.cwd(), argv, next);
if (argv.safe) next();
