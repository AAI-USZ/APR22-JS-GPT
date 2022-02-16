




var libxml = require('support/libxmljs')



ElementCollection = Collection.extend({



init: function(markup) {
if (typeof markup != 'string')
return this.__super__(markup)
if (!(/<html>/.test(markup)))
markup = '<html><body>' + markup + '</body></html>'
this.document = libxml.parseString(markup)
this.arr = [this.document.root()]
},



name: function() {
