for (var key in connect.middleware) {
var desc = Object.getOwnPropertyDescriptor(connect.middleware, key);
Object.defineProperty(exports, key, desc);
