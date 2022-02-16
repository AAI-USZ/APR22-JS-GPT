


global.DOCUMENT_ROOT = __dirname.substr(0, __dirname.indexOf(path.sep+'include'));

global.LOG_LEVEL = 'debug';
global.LOG_FILE  = DOCUMENT_ROOT + '/log/pencilblue.log';

var config = {
siteName: 'pencilblue',
siteRoot: 'http://localhost:8080',
siteIP:   '127.0.0.1',
sitePort: 8080,
docRoot:  DOCUMENT_ROOT,
db: {
type:'mongo',
servers: [
'mongodb://192.168.1.73:27017/'
],
name: 'pencil_blue',
writeConern: 1
},
logging: {
transports: [
new (winston.transports.Console)({ level: LOG_LEVEL, timestamp: true }),
new (winston.transports.File)({ filename: LOG_FILE, level: LOG_LEVEL, timestamp: true })
]
}
};


global.loadConfiguration = function() {


if(!fs.existsSync(LOG_FILE))
{
if(!fs.existsSync(DOCUMENT_ROOT + '/log/'))
{
fs.mkdirSync(DOCUMENT_ROOT + '/log/');
}
