

'use strict';

const MongooseError = require('./mongooseError');



MongooseError.call(this, message);
if (Error.captureStackTrace) {
Error.captureStackTrace(this);
} else {
this.stack = new Error().stack;
}
}



