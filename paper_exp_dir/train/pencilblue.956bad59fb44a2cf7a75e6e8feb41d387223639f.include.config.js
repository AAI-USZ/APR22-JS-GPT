


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
'mongodb://127.0.0.1:27017/'
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

fs.writeFileSync(DOCUMENT_ROOT + '/log/pencilblue.log', '');
}


if(fs.existsSync(DOCUMENT_ROOT + '/config.json'))
{
var result = fs.readFileSync(DOCUMENT_ROOT + '/config.json', {encoding: "UTF-8"});

var override = null;
if (typeof result === 'Error') {
console.log('Failed to read external configuration file. Using defaults: '+err);
return config;
}
else{
try{
override = JSON.parse(result);
}
catch(e){
console.log('Failed to parse configuration file.  Using defaults: '+e);
return config;
}
}

for(var key in override) {
console.log("Overriding property: KEY="+key+" VAL="+JSON.stringify(override[key]));
config[key] = override[key];
}
}
return config;
};

module.exports = loadConfiguration();
