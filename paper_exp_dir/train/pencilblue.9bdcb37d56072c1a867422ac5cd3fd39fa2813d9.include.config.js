


global.DOCUMENT_ROOT = __dirname.substr(0, __dirname.indexOf(path.sep+'include'));
global.EXTERNAL_ROOT = path.join(path.sep, 'etc', 'pencilblue');

global.LOG_LEVEL = 'debug';
global.LOG_DIR   = path.join(DOCUMENT_ROOT, 'log');
global.LOG_FILE  = path.join(LOG_DIR, 'pencilblue.log');

var config = {
siteName: 'pencilblue',
siteRoot: 'http://localhost:8080',
siteIP:   '127.0.0.1',
