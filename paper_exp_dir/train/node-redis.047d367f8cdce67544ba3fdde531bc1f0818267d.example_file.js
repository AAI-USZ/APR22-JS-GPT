var redis = require("redis"),
client = redis.createClient(),
fs = require("fs"),
filename = "kids_in_cart.jpg";






fs.readFile(filename, function (err, data) {
if (err) throw err
console.log("Read " + data.length + " bytes from filesystem.");

client.set(filename, data, redis.print);
client.get(filename, function (err, reply) {
if (err) {
console.log("Get error: " + err);
} else {
fs.writeFile("duplicate_" + filename, reply, function (err) {
if (err) {
console.log("Error on write: " + err)
} else {
console.log("File written.");
}
client.end();
});
}
});
});
