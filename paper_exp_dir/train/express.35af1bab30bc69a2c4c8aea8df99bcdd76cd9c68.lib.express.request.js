




var http = require('http');



function isxhr() {
return (this.headers['x-requested-with'] || '').toLowerCase() === 'xmlhttprequest';
}
