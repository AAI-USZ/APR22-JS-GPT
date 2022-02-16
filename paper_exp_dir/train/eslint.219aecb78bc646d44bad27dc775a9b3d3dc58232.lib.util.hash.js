

"use strict";





const murmur = require("imurmurhash");










function hash(str) {
return murmur(str).result().toString(36);
}





module.exports = hash;
