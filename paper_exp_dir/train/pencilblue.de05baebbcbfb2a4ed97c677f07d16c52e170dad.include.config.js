


global.DOCUMENT_ROOT = __dirname.substr(0, __dirname.indexOf(path.sep+'include'));

global.LOG_LEVEL = 'debug';
global.LOG_FOLDER = '/log/';
global.LOG_FILE  = DOCUMENT_ROOT + LOG_FOLDER + 'pencilblue.log';

var config = {
siteName: 'pencilblue',
siteRoot: 'http://localhost:8080',
siteIP:   '127.0.0.1',
sitePort: 8080,
docRoot:  DOCUMENT_ROOT,
db: {
