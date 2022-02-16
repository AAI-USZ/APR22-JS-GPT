var redis = require("redis"),
client1 = redis.createClient(), msg_count = 0,
client2 = redis.createClient();

redis.debug_mode = false;


client1.on("subscribe", function (channel, count) {
console.log("client1 subscribed to " + channel + ", " + count + " total subscriptions");
if (count === 2) {
client2.publish("a nice channel", "I am sending a message.");
client2.publish("another one", "I am sending a second message.");
client2.publish("a nice channel", "I am sending my last message.");
}
});

