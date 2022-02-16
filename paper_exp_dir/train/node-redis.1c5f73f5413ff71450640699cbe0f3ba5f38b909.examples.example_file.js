

var redis = require("redis"),
client = redis.createClient(),
fs = require("fs"),
filename = "kids_in_cart.jpg";






fs.readFile(filename, function (err, data) {
if (err) throw err
