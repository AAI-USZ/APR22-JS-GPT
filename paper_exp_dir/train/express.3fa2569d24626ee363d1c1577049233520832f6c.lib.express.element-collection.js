




var libxml = require('support/libxmljs')



ElementCollection = Collection.extend({



init: function(markup) {
this.document = libxml.parseString(markup)
this.arr = this.document.children()
},
