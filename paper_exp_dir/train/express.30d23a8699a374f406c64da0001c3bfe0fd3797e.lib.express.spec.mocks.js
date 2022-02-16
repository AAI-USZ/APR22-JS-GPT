




var MockRequest = Class({



httpVersion: '1.1',



init: function(method, path, options) {
this.method = method
this.url = path
this.connection = {
remoteAddress: '127.0.0.1'
}
this.headers = {
'host': 'localhost',
'user-agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_8; en-us) AppleWebKit/530.19.2 (KHTML, like Gecko) Version/4.0.2 Safari/530.19',
'accept': 'application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5',
'accept-language': 'en-us',
'connection': 'keep-alive'
