var redis  = require("redis"),
client = redis.createClient(), multi;


multi = client.multi();
multi.incr("incr thing", redis.print);
multi.incr("incr other thing", redis.print);


client.mset("incr thing", 100, "incr other thing", 1, redis.print);


multi.exec(function (err, replies) {
console.log(replies);
});


multi.exec(function (err, replies) {
console.log(replies);
client.quit();
});

client.multi([
["mget", "multifoo", "multibar", redis.print],
["incr", "multifoo"],
["incr", "multibar"]
]).exec(function (err, replies) {
console.log(replies.toString());
});
