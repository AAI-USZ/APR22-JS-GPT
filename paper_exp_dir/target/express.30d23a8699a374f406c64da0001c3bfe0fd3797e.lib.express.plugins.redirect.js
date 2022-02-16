redirect: function(url, code) {
if (url == 'back' || url == 'home') url = this[url]
this.header('location', url)
