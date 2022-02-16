var redis  = require("redis"),
client = redis.createClient(), set_size = 20;

client.sadd("bigset", "a member");
client.sadd("bigset", "another member");

while (set_size > 0) {
client.sadd("bigset", "member " + set_size);
set_size -= 1;
}


client.multi()
.scard("bigset")
.smembers("bigset")
.keys("*", function (err, replies) {
client.mget(replies, redis.print);
})
.dbsize()
.exec(function (err, replies) {
console.log("MULTI got " + replies.length + " replies");
replies.forEach(function (reply, index) {
console.log("Reply " + index + ": " + reply.toString());
});
});

client.mset("incr thing", 100, "incr other thing", 1, redis.print);


var multi = client.multi();
multi.incr("incr thing", redis.print);
multi.incr("incr other thing", redis.print);


client.get("incr thing", redis.print);


multi.exec(function (err, replies) {
console.log(replies);
});


multi.exec(function (err, replies) {
console.log(replies);
client.quit();
});
