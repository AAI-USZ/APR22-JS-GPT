if (process.env.HTTP_PROXY) {
var proxy = url.parse(process.env.HTTP_PROXY);
proxy.path = this.assetUrl;
