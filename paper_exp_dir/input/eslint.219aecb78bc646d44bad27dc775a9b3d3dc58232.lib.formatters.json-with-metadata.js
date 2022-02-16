
"use strict";





module.exports = function(results, data) {
return JSON.stringify({
results,
metadata: data
});
};
