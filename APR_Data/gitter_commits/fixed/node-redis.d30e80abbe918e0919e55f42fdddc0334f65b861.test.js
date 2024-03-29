/*global require console setTimeout process Buffer */
var PORT = 6379;
var HOST = '127.0.0.1';
var parser = process.argv[3];

var redis = require("../index"),
    client = redis.createClient(PORT, HOST, { parser: parser }),
    client2 = redis.createClient(PORT, HOST, { parser: parser }),
    client3 = redis.createClient(PORT, HOST, { parser: parser }),
    bclient = redis.createClient(PORT, HOST, { return_buffers: true, parser: parser }),
    assert = require("assert"),
    crypto = require("crypto"),
    util = require("../lib/util"),
    fork = require("child_process").fork,
    test_db_num = 15, // this DB will be flushed and used for testing
    tests = {},
    connected = false,
    ended = false,
    next, cur_start, run_next_test, all_tests, all_start, test_count;

// Set this to truthy to see the wire protocol and other debugging info
redis.debug_mode = process.argv[2] ? JSON.parse(process.argv[2]) : false;

function server_version_at_least(connection, desired_version) {
    // Return true if the server version >= desired_version
    var version = connection.server_info.versions;
    for (var i = 0; i < 3; i++) {
        if (version[i] > desired_version[i]) return true;
        if (version[i] < desired_version[i]) return false;
    }
    return true;
}

function buffers_to_strings(arr) {
    return arr.map(function (val) {
        return val.toString();
    });
}

function require_number(expected, label) {
    return function (err, results) {
        assert.strictEqual(null, err, label + " expected " + expected + ", got error: " + err);
        assert.strictEqual(expected, results, label + " " + expected + " !== " + results);
        assert.strictEqual(typeof results, "number", label);
        return true;
    };
}

function require_number_any(label) {
    return function (err, results) {
        assert.strictEqual(null, err, label + " expected any number, got error: " + err);
        assert.strictEqual(typeof results, "number", label + " " + results + " is not a number");
        return true;
    };
}

function require_number_pos(label) {
    return function (err, results) {
        assert.strictEqual(null, err, label + " expected positive number, got error: " + err);
        assert.strictEqual(true, (results > 0), label + " " + results + " is not a positive number");
        return true;
    };
}

function require_string(str, label) {
    return function (err, results) {
        assert.strictEqual(null, err, label + " expected string '" + str + "', got error: " + err);
        assert.equal(str, results, label + " " + str + " does not match " + results);
        return true;
    };
}

function require_null(label) {
    return function (err, results) {
        assert.strictEqual(null, err, label + " expected null, got error: " + err);
        assert.strictEqual(null, results, label + ": " + results + " is not null");
        return true;
    };
}

function require_error(label) {
    return function (err, results) {
        assert.notEqual(err, null, label + " err is null, but an error is expected here.");
        return true;
    };
}

function is_empty_array(obj) {
    return Array.isArray(obj) && obj.length === 0;
}

function last(name, fn) {
    return function (err, results) {
        fn(err, results);
        next(name);
    };
}

// Wraps the given callback in a timeout. If the returned function
// is not called within the timeout period, we fail the named test.
function with_timeout(name, cb, millis) {
    var timeoutId = setTimeout(function() {
        assert.fail("Callback timed out!", name);
    }, millis);
    return function() {
        clearTimeout(timeoutId);
        cb.apply(this, arguments);
    };
}

next = function next(name) {
    console.log(" \x1b[33m" + (Date.now() - cur_start) + "\x1b[0m ms");
    run_next_test();
};

// Tests are run in the order they are defined, so FLUSHDB should always be first.

tests.IPV4 = function () {
    var ipv4Client = redis.createClient( PORT, "127.0.0.1", { family : "IPv4", parser: parser } );

    ipv4Client.once("ready", function start_tests() {
        console.log("Connected to " + ipv4Client.address + ", Redis server version " + ipv4Client.server_info.redis_version + "\n");
        console.log("Using reply parser " + ipv4Client.reply_parser.name);

        ipv4Client.quit();
        run_next_test();
    });

    ipv4Client.on('end', function () {

    });

    // Exit immediately on connection failure, which triggers "exit", below, which fails the test
    ipv4Client.on("error", function (err) {
        console.error("client: " + err.stack);
        process.exit();
    });
}

tests.IPV6 = function () {
    if (!server_version_at_least(client, [2, 8, 0])) {
        console.log("Skipping IPV6 for old Redis server version < 2.8.0");
        return run_next_test();
    }
    var ipv6Client = redis.createClient( PORT, "::1", { family: "IPv6", parser: parser } );

    ipv6Client.once("ready", function start_tests() {
        console.log("Connected to " + ipv6Client.address + ", Redis server version " + ipv6Client.server_info.redis_version + "\n");
        console.log("Using reply parser " + ipv6Client.reply_parser.name);

        ipv6Client.quit();
        run_next_test();
    });

    ipv6Client.on('end', function () {

    });

    // Exit immediately on connection failure, which triggers "exit", below, which fails the test
    ipv6Client.on("error", function (err) {
        console.error("client: " + err.stack);
        process.exit();
    });
}

tests.UNIX_SOCKET = function () {
    var unixClient = redis.createClient('/tmp/redis.sock', { parser: parser });

    // if this fails, check the permission of unix socket.
    // unixsocket /tmp/redis.sock
    // unixsocketperm 777

    unixClient.once('ready', function start_tests(){
        console.log("Connected to " + unixClient.address + ", Redis server version " + unixClient.server_info.redis_version + "\n");
        console.log("Using reply parser " + unixClient.reply_parser.name);

        unixClient.quit();
        run_next_test();
    });

    unixClient.on( 'end', function(){

    });

    // Exit immediately on connection failure, which triggers "exit", below, which fails the test
    unixClient.on("error", function (err) {
        console.error("client: " + err.stack);
        process.exit();
    });
}

tests.FLUSHDB = function () {
    var name = "FLUSHDB";
    client.select(test_db_num, require_string("OK", name));
    client2.select(test_db_num, require_string("OK", name));
    client3.select(test_db_num, require_string("OK", name));
    client.mset("flush keys 1", "flush val 1", "flush keys 2", "flush val 2", require_string("OK", name));
    client.FLUSHDB(require_string("OK", name));
    client.dbsize(last(name, require_number(0, name)));
};

tests.INCR = function () {
    var name = "INCR";

    if (bclient.reply_parser.name == "hiredis") {
        console.log("Skipping INCR buffer test with hiredis");
        return next(name);
    }

    // Test incr with the maximum JavaScript number value. Since we are
    // returning buffers we should get back one more as a Buffer.
    bclient.set("seq", "9007199254740992", function (err, result) {
        assert.strictEqual(result.toString(), "OK");
        bclient.incr("seq", function (err, result) {
            assert.strictEqual("9007199254740993", result.toString());
            next(name);
        });
    });
};

tests.MULTI_1 = function () {
    var name = "MULTI_1", multi1, multi2;

    // Provoke an error at queue time
    multi1 = client.multi();
    multi1.mset("multifoo", "10", "multibar", "20", require_string("OK", name));
    multi1.set("foo2", require_error(name));
    multi1.incr("multifoo", require_number(11, name));
    multi1.incr("multibar", require_number(21, name));
    multi1.exec(function () {
        require_error(name);

        // Redis 2.6.5+ will abort transactions with errors
        // see: http://redis.io/topics/transactions
        var multibar_expected = 22;
        var multifoo_expected = 12;
        if (server_version_at_least(client, [2, 6, 5])) {
            multibar_expected = 1;
            multifoo_expected = 1;
        }

        // Confirm that the previous command, while containing an error, still worked.
        multi2 = client.multi();
        multi2.incr("multibar", require_number(multibar_expected, name));
        multi2.incr("multifoo", require_number(multifoo_expected, name));
        multi2.exec(function (err, replies) {
            assert.strictEqual(multibar_expected, replies[0]);
            assert.strictEqual(multifoo_expected, replies[1]);
            next(name);
        });
    });
};

tests.MULTI_2 = function () {
    var name = "MULTI_2";

    // test nested multi-bulk replies
    client.multi([
        ["mget", "multifoo", "multibar", function (err, res) {
            assert.strictEqual(2, res.length, name);
            assert.strictEqual("12", res[0].toString(), name);
            assert.strictEqual("22", res[1].toString(), name);
        }],
        ["set", "foo2", require_error(name)],
        ["incr", "multifoo", require_number(13, name)],
        ["incr", "multibar", require_number(23, name)]

    ]).exec(function (err, replies) {

        if (server_version_at_least(client, [2, 6, 5])) {
            assert.notEqual(err, null, name);
            assert.equal(replies, undefined, name);
        } else {
            assert.strictEqual(2, replies[0].length, name);
            assert.strictEqual("12", replies[0][0].toString(), name);
            assert.strictEqual("22", replies[0][1].toString(), name);

            assert.strictEqual("13", replies[1].toString());
            assert.strictEqual("23", replies[2].toString());
        }
        next(name);
    });
};

tests.MULTI_3 = function () {
    var name = "MULTI_3";

    client.sadd("some set", "mem 1");
    client.sadd("some set", "mem 2");
    client.sadd("some set", "mem 3");
    client.sadd("some set", "mem 4");

    // make sure empty mb reply works
    client.del("some missing set");
    client.smembers("some missing set", function (err, reply) {
        // make sure empty mb reply works
        assert.strictEqual(true, is_empty_array(reply), name);
    });

    // test nested multi-bulk replies with empty mb elements.
    client.multi([
        ["smembers", "some set"],
        ["del", "some set"],
        ["smembers", "some set"]
    ])
    .scard("some set")
    .exec(function (err, replies) {
        assert.strictEqual(true, is_empty_array(replies[2]), name);
        next(name);
    });
};

tests.MULTI_4 = function () {
    var name = "MULTI_4";

    client.multi()
        .mset('some', '10', 'keys', '20')
        .incr('some')
        .incr('keys')
        .mget('some', 'keys')
        .exec(function (err, replies) {
            assert.strictEqual(null, err);
            assert.equal('OK', replies[0]);
            assert.equal(11, replies[1]);
            assert.equal(21, replies[2]);
            assert.equal(11, replies[3][0].toString());
            assert.equal(21, replies[3][1].toString());
            next(name);
        });
};

tests.MULTI_5 = function () {
    var name = "MULTI_5";

    // test nested multi-bulk replies with nulls.
    client.multi([
        ["mget", ["multifoo", "some", "random value", "keys"]],
        ["incr", "multifoo"]
    ])
    .exec(function (err, replies) {
        assert.strictEqual(replies.length, 2, name);
        assert.strictEqual(replies[0].length, 4, name);
        next(name);
    });
};

tests.MULTI_6 = function () {
    var name = "MULTI_6";

    client.multi()
        .hmset("multihash", "a", "foo", "b", 1)
        .hmset("multihash", {
            extra: "fancy",
            things: "here"
        })
        .hgetall("multihash")
        .exec(function (err, replies) {
            assert.strictEqual(null, err);
            assert.equal("OK", replies[0]);
            assert.equal(Object.keys(replies[2]).length, 4);
            assert.equal("foo", replies[2].a);
            assert.equal("1", replies[2].b);
            assert.equal("fancy", replies[2].extra);
            assert.equal("here", replies[2].things);
            next(name);
        });
};

tests.MULTI_7 = function () {
    var name = "MULTI_7";

    if (bclient.reply_parser.name != "javascript") {
        console.log("Skipping wire-protocol test for 3rd-party parser");
        return next(name);
    }

    var p = require("../lib/parser/javascript");
    var parser = new p.Parser(false);
    var reply_count = 0;
    function check_reply(reply) {
        assert.deepEqual(reply, [['a']], "Expecting multi-bulk reply of [['a']]");
        reply_count++;
        assert.notEqual(reply_count, 4, "Should only parse 3 replies");
    }
    parser.on("reply", check_reply);

    parser.execute(new Buffer('*1\r\n*1\r\n$1\r\na\r\n'));

    parser.execute(new Buffer('*1\r\n*1\r'));
    parser.execute(new Buffer('\n$1\r\na\r\n'));

    parser.execute(new Buffer('*1\r\n*1\r\n'));
    parser.execute(new Buffer('$1\r\na\r\n'));

    next(name);
};


tests.MULTI_EXCEPTION_1 = function() {
    var name = "MULTI_EXCEPTION_1";

    if (!server_version_at_least(client, [2, 6, 5])) {
        console.log("Skipping " + name + " for old Redis server version < 2.6.5");
        return next(name);
    }

    client.multi().set("foo").exec(function (err, reply) {
        assert(Array.isArray(err), "err should be an array");
        assert.equal(2, err.length, "err should have 2 items");
        assert(err[0].message.match(/ERR/), "First error message should contain ERR");
        assert(err[1].message.match(/EXECABORT/), "First error message should contain EXECABORT");
        next(name);
    });
};

tests.MULTI_8 = function () {
    var name = "MULTI_8", multi1, multi2;

    // Provoke an error at queue time
    multi1 = client.multi();
    multi1.mset("multifoo_8", "10", "multibar_8", "20", require_string("OK", name));
    multi1.set("foo2", require_error(name));
    multi1.set("foo3", require_error(name));
    multi1.incr("multifoo_8", require_number(11, name));
    multi1.incr("multibar_8", require_number(21, name));
    multi1.exec(function () {
        require_error(name);

        // Redis 2.6.5+ will abort transactions with errors
        // see: http://redis.io/topics/transactions
        var multibar_expected = 22;
        var multifoo_expected = 12;
        if (server_version_at_least(client, [2, 6, 5])) {
            multibar_expected = 1;
            multifoo_expected = 1;
        }

        // Confirm that the previous command, while containing an error, still worked.
        multi2 = client.multi();
        multi2.incr("multibar_8", require_number(multibar_expected, name));
        multi2.incr("multifoo_8", require_number(multifoo_expected, name));
        multi2.exec(function (err, replies) {
            assert.strictEqual(multibar_expected, replies[0]);
            assert.strictEqual(multifoo_expected, replies[1]);
            next(name);
        });
    });
};

tests.FWD_ERRORS_1 = function () {
    var name = "FWD_ERRORS_1";

    var toThrow = new Error("Forced exception");
    var recordedError = null;

    var originalHandlers = {
        "error": client3.listeners("error"),
        "message": client3.listeners("message")
    };
    client3.removeAllListeners("error");
    client3.removeAllListeners("message");
    client3.once("error", function (err) {
        recordedError = err;
    });

    client3.on("message", function (channel, data) {
        console.log("incoming");
        if (channel == name) {
            assert.equal(data, "Some message");
            throw toThrow;
        }
    });
    client3.subscribe(name);

    client.publish(name, "Some message");
    setTimeout(function () {
        assert.equal(recordedError, toThrow, "Should have caught our forced exception");
        client3.unsubscribe(name);
        client3.removeAllListeners("message");
        originalHandlers.error.forEach(function (fn) {
            client3.on("error", fn);
        });
        originalHandlers.message.forEach(function (fn) {
            client3.on("message", fn);
        });
        next(name);
    }, 150);
};

tests.EVAL_1 = function () {
    var name = "EVAL_1";

    if (!server_version_at_least(client, [2, 5, 0])) {
        console.log("Skipping " + name + " for old Redis server version < 2.5.x");
        return next(name);
    }

    // test {EVAL - Lua integer -> Redis protocol type conversion}
    client.eval("return 100.5", 0, require_number(100, name));
    // test {EVAL - Lua string -> Redis protocol type conversion}
    client.eval("return 'hello world'", 0, require_string("hello world", name));
    // test {EVAL - Lua true boolean -> Redis protocol type conversion}
    client.eval("return true", 0, require_number(1, name));
    // test {EVAL - Lua false boolean -> Redis protocol type conversion}
    client.eval("return false", 0, require_null(name));
    // test {EVAL - Lua status code reply -> Redis protocol type conversion}
    client.eval("return {ok='fine'}", 0, require_string("fine", name));
    // test {EVAL - Lua error reply -> Redis protocol type conversion}
    client.eval("return {err='this is an error'}", 0, require_error(name));
    // test {EVAL - Lua table -> Redis protocol type conversion}
    client.eval("return {1,2,3,'ciao',{1,2}}", 0, function (err, res) {
        assert.strictEqual(5, res.length, name);
        assert.strictEqual(1, res[0], name);
        assert.strictEqual(2, res[1], name);
        assert.strictEqual(3, res[2], name);
        assert.strictEqual("ciao", res[3], name);
        assert.strictEqual(2, res[4].length, name);
        assert.strictEqual(1, res[4][0], name);
        assert.strictEqual(2, res[4][1], name);
    });
    // test {EVAL - Are the KEYS and ARGS arrays populated correctly?}
    client.eval("return {KEYS[1],KEYS[2],ARGV[1],ARGV[2]}", 2, "a", "b", "c", "d", function (err, res) {
        assert.strictEqual(4, res.length, name);
        assert.strictEqual("a", res[0], name);
        assert.strictEqual("b", res[1], name);
        assert.strictEqual("c", res[2], name);
        assert.strictEqual("d", res[3], name);
    });

    // test {EVAL - parameters in array format gives same result}
    client.eval(["return {KEYS[1],KEYS[2],ARGV[1],ARGV[2]}", 2, "a", "b", "c", "d"], function (err, res) {
        assert.strictEqual(4, res.length, name);
        assert.strictEqual("a", res[0], name);
        assert.strictEqual("b", res[1], name);
        assert.strictEqual("c", res[2], name);
        assert.strictEqual("d", res[3], name);
    });

    // prepare sha sum for evalsha cache test
    var source = "return redis.call('get', 'sha test')",
        sha = crypto.createHash('sha1').update(source).digest('hex');

    client.set("sha test", "eval get sha test", function (err, res) {
        if (err) throw err;
        // test {EVAL - is Lua able to call Redis API?}
        client.eval(source, 0, function (err, res) {
            require_string("eval get sha test", name)(err, res);
            // test {EVALSHA - Can we call a SHA1 if already defined?}
            client.evalsha(sha, 0, require_string("eval get sha test", name));
            // test {EVALSHA - Do we get an error on non defined SHA1?}
            client.evalsha("ffffffffffffffffffffffffffffffffffffffff", 0, require_error(name));
        });
    });

    // test {EVAL - Redis integer -> Lua type conversion}
    client.set("incr key", 0, function (err, reply) {
        if (err) throw err;
        client.eval("local foo = redis.call('incr','incr key')\n" + "return {type(foo),foo}", 0, function (err, res) {
            if (err) throw err;
            assert.strictEqual(2, res.length, name);
            assert.strictEqual("number", res[0], name);
            assert.strictEqual(1, res[1], name);
        });
    });

    client.set("bulk reply key", "bulk reply value", function (err, res) {
        // test {EVAL - Redis bulk -> Lua type conversion}
        client.eval("local foo = redis.call('get','bulk reply key'); return {type(foo),foo}", 0, function (err, res) {
            if (err) throw err;
            assert.strictEqual(2, res.length, name);
            assert.strictEqual("string", res[0], name);
            assert.strictEqual("bulk reply value", res[1], name);
        });
    });

    // test {EVAL - Redis multi bulk -> Lua type conversion}
    client.multi()
        .del("mylist")
        .rpush("mylist", "a")
        .rpush("mylist", "b")
        .rpush("mylist", "c")
        .exec(function (err, replies) {
            if (err) throw err;
            client.eval("local foo = redis.call('lrange','mylist',0,-1); return {type(foo),foo[1],foo[2],foo[3],# foo}", 0, function (err, res) {
                assert.strictEqual(5, res.length, name);
                assert.strictEqual("table", res[0], name);
                assert.strictEqual("a", res[1], name);
                assert.strictEqual("b", res[2], name);
                assert.strictEqual("c", res[3], name);
                assert.strictEqual(3, res[4], name);
            });
        });
    // test {EVAL - Redis status reply -> Lua type conversion}
    client.eval("local foo = redis.call('set','mykey','myval'); return {type(foo),foo['ok']}", 0, function (err, res) {
        if (err) throw err;
        assert.strictEqual(2, res.length, name);
        assert.strictEqual("table", res[0], name);
        assert.strictEqual("OK", res[1], name);
    });
    // test {EVAL - Redis error reply -> Lua type conversion}
    client.set("error reply key", "error reply value", function (err, res) {
        if (err) throw err;
        client.eval("local foo = redis.pcall('incr','error reply key'); return {type(foo),foo['err']}", 0, function (err, res) {
            if (err) throw err;
            assert.strictEqual(2, res.length, name);
            assert.strictEqual("table", res[0], name);
            assert.strictEqual("ERR value is not an integer or out of range", res[1], name);
        });
    });
    // test {EVAL - Redis nil bulk reply -> Lua type conversion}
    client.del("nil reply key", function (err, res) {
        if (err) throw err;
        client.eval("local foo = redis.call('get','nil reply key'); return {type(foo),foo == false}", 0, function (err, res) {
            if (err) throw err;
            assert.strictEqual(2, res.length, name);
            assert.strictEqual("boolean", res[0], name);
            assert.strictEqual(1, res[1], name);
            next(name);
        });
    });
};

tests.SCRIPT_LOAD = function() {
    var name = "SCRIPT_LOAD",
        command = "return 1",
        commandSha = crypto.createHash('sha1').update(command).digest('hex');

    if (!server_version_at_least(client, [2, 6, 0])) {
        console.log("Skipping " + name + " for old Redis server version < 2.6.x");
        return next(name);
    }

    bclient.script("load", command, function(err, result) {
        assert.strictEqual(result.toString(), commandSha);
        client.multi().script("load", command).exec(function(err, result) {
            assert.strictEqual(result[0].toString(), commandSha);
            client.multi([['script', 'load', command]]).exec(function(err, result) {
                assert.strictEqual(result[0].toString(), commandSha);
                next(name);
            });
        });
    });
};

tests.CLIENT_LIST = function() {
    var name = "CLIENT_LIST";

    if (!server_version_at_least(client, [2, 4, 0])) {
        console.log("Skipping " + name + " for old Redis server version < 2.4.x");
        return next(name);
    }

    var pattern = /^addr=/;
    if ( server_version_at_least(client, [2, 8, 12])) {
        pattern = /^id=\d+ addr=/;
    }

    function checkResult(result) {
        var lines = result.toString().split('\n').slice(0, -1);
        assert.strictEqual(lines.length, 4);
        assert(lines.every(function(line) {
            return line.match(pattern);
        }));
    }

    bclient.client("list", function(err, result) {
        console.log(result.toString());
        checkResult(result);
        client.multi().client("list").exec(function(err, result) {
            console.log(result.toString());
            checkResult(result);
            client.multi([['client', 'list']]).exec(function(err, result) {
                console.log(result.toString());
                checkResult(result);
                next(name);
            });
        });
    });
};

tests.WATCH_MULTI = function () {
    var name = 'WATCH_MULTI', multi;
    if (!server_version_at_least(client, [2, 2, 0])) {
        console.log("Skipping " + name + " for old Redis server version < 2.2.x");
        return next(name);
    }

    client.watch(name);
    client.incr(name);
    multi = client.multi();
    multi.incr(name);
    multi.exec(last(name, require_null(name)));
};

tests.WATCH_TRANSACTION = function () {
    var name = "WATCH_TRANSACTION";

    if (!server_version_at_least(client, [2, 1, 0])) {
        console.log("Skipping " + name + " because server version isn't new enough.");
        return next(name);
    }

    // Test WATCH command aborting transactions, look for parser offset errors.

    client.set("unwatched", 200);

    client.set(name, 0);
    client.watch(name);
    client.incr(name);
    var multi = client.multi()
        .incr(name)
        .exec(function (err, replies) {
            // Failure expected because of pre-multi incr
            assert.strictEqual(replies, null, "Aborted transaction multi-bulk reply should be null.");

            client.get("unwatched", function (err, reply) {
                assert.equal(err, null, name);
                assert.equal(reply, 200, "Expected 200, got " + reply);
                next(name);
            });
        });

    client.set("unrelated", 100, function (err, reply) {
        assert.equal(err, null, name);
        assert.equal(reply, "OK", "Expected 'OK', got " + reply);
    });
};


tests.detect_buffers = function () {
    var name = "detect_buffers", detect_client = redis.createClient({ detect_buffers: true, parser: parser });

    detect_client.on("ready", function () {
        // single Buffer or String
        detect_client.set("string key 1", "string value");
        detect_client.get("string key 1", require_string("string value", name));
        detect_client.get(new Buffer("string key 1"), function (err, reply) {
            assert.strictEqual(null, err, name);
            assert.strictEqual(true, Buffer.isBuffer(reply), name);
            assert.strictEqual("<Buffer 73 74 72 69 6e 67 20 76 61 6c 75 65>", reply.inspect(), name);
        });

        detect_client.hmset("hash key 2", "key 1", "val 1", "key 2", "val 2");
        // array of Buffers or Strings
        detect_client.hmget("hash key 2", "key 1", "key 2", function (err, reply) {
            assert.strictEqual(null, err, name);
            assert.strictEqual(true, Array.isArray(reply), name);
            assert.strictEqual(2, reply.length, name);
            assert.strictEqual("val 1", reply[0], name);
            assert.strictEqual("val 2", reply[1], name);
        });
        detect_client.hmget(new Buffer("hash key 2"), "key 1", "key 2", function (err, reply) {
            assert.strictEqual(null, err, name);
            assert.strictEqual(true, Array.isArray(reply));
            assert.strictEqual(2, reply.length, name);
            assert.strictEqual(true, Buffer.isBuffer(reply[0]));
            assert.strictEqual(true, Buffer.isBuffer(reply[1]));
            assert.strictEqual("<Buffer 76 61 6c 20 31>", reply[0].inspect(), name);
            assert.strictEqual("<Buffer 76 61 6c 20 32>", reply[1].inspect(), name);
        });

        // array of strings with undefined values (repro #344)
        detect_client.hmget("hash key 2", "key 3", "key 4", function(err, reply) {
            assert.strictEqual(null, err, name);
            assert.strictEqual(true, Array.isArray(reply), name);
            assert.strictEqual(2, reply.length, name);
            assert.equal(null, reply[0], name);
            assert.equal(null, reply[1], name);
        });

        // Object of Buffers or Strings
        detect_client.hgetall("hash key 2", function (err, reply) {
            assert.strictEqual(null, err, name);
            assert.strictEqual("object", typeof reply, name);
            assert.strictEqual(2, Object.keys(reply).length, name);
            assert.strictEqual("val 1", reply["key 1"], name);
            assert.strictEqual("val 2", reply["key 2"], name);
        });
        detect_client.hgetall(new Buffer("hash key 2"), function (err, reply) {
            assert.strictEqual(null, err, name);
            assert.strictEqual("object", typeof reply, name);
            assert.strictEqual(2, Object.keys(reply).length, name);
            assert.strictEqual(true, Buffer.isBuffer(reply["key 1"]));
            assert.strictEqual(true, Buffer.isBuffer(reply["key 2"]));
            assert.strictEqual("<Buffer 76 61 6c 20 31>", reply["key 1"].inspect(), name);
            assert.strictEqual("<Buffer 76 61 6c 20 32>", reply["key 2"].inspect(), name);
        });

        detect_client.quit(function (err, res) {
            next(name);
        });
    });
};

tests.socket_nodelay = function () {
    var name = "socket_nodelay", c1, c2, c3, ready_count = 0, quit_count = 0;

    c1 = redis.createClient({ socket_nodelay: true, parser: parser });
    c2 = redis.createClient({ socket_nodelay: false, parser: parser });
    c3 = redis.createClient({ parser: parser });

    function quit_check() {
        quit_count++;

        if (quit_count === 3) {
            next(name);
        }
    }

    function run() {
        assert.strictEqual(true, c1.options.socket_nodelay, name);
        assert.strictEqual(false, c2.options.socket_nodelay, name);
        assert.strictEqual(true, c3.options.socket_nodelay, name);

        c1.set(["set key 1", "set val"], require_string("OK", name));
        c1.set(["set key 2", "set val"], require_string("OK", name));
        c1.get(["set key 1"], require_string("set val", name));
        c1.get(["set key 2"], require_string("set val", name));

        c2.set(["set key 3", "set val"], require_string("OK", name));
        c2.set(["set key 4", "set val"], require_string("OK", name));
        c2.get(["set key 3"], require_string("set val", name));
        c2.get(["set key 4"], require_string("set val", name));

        c3.set(["set key 5", "set val"], require_string("OK", name));
        c3.set(["set key 6", "set val"], require_string("OK", name));
        c3.get(["set key 5"], require_string("set val", name));
        c3.get(["set key 6"], require_string("set val", name));

        c1.quit(quit_check);
        c2.quit(quit_check);
        c3.quit(quit_check);
    }

    function ready_check() {
        ready_count++;
        if (ready_count === 3) {
            run();
        }
    }

    c1.on("ready", ready_check);
    c2.on("ready", ready_check);
    c3.on("ready", ready_check);
};

tests.reconnect = function () {
    var name = "reconnect";

    client.set("recon 1", "one");
    client.set("recon 2", "two", function (err, res) {
        // Do not do this in normal programs. This is to simulate the server closing on us.
        // For orderly shutdown in normal programs, do client.quit()
        client.stream.destroy();
    });

    client.on("reconnecting", function on_recon(params) {
        client.on("connect", function on_connect() {
            client.select(test_db_num, require_string("OK", name));
            client.get("recon 1", require_string("one", name));
            client.get("recon 1", require_string("one", name));
            client.get("recon 2", require_string("two", name));
            client.get("recon 2", require_string("two", name));
            client.removeListener("connect", on_connect);
            client.removeListener("reconnecting", on_recon);
            next(name);
        });
    });
};

tests.reconnect_select_db_after_pubsub = function() {
    var name = "reconnect_select_db_after_pubsub";

    client.select(test_db_num);
    client.set(name, "one");
    client.subscribe('ChannelV', function (err, res) {
        client.stream.destroy();
    });

    client.on("reconnecting", function on_recon(params) {
        client.on("ready", function on_connect() {
            client.unsubscribe('ChannelV', function (err, res) {
                client.get(name, require_string("one", name));
                client.removeListener("connect", on_connect);
                client.removeListener("reconnecting", on_recon);
                next(name);
            });
        });
    });
};

tests.select_error_emits_if_no_callback = function () {
    var prev = client.listeners("error")[0];
    client.removeListener("error", prev);
    var name = "select_error_emits_if_no_callback";
    var handler = with_timeout(name, function (err) {
        require_error(name)(err);
        client.removeListener('error', handler);
        client.on("error", prev);
        next(name);
    }, 500);
    client.on('error', handler);
    client.select(9999);
};

tests.idle = function () {
  var name = "idle";

  client.on("idle", function on_idle() {
    client.removeListener("idle", on_idle);
    next(name);
  });

  client.set("idle", "test");
};

tests.HSET = function () {
    var key = "test hash",
        field1 = new Buffer("0123456789"),
        value1 = new Buffer("abcdefghij"),
        field2 = new Buffer(0),
        value2 = new Buffer(0),
        name = "HSET";

    client.HSET(key, field1, value1, require_number(1, name));
    client.HGET(key, field1, require_string(value1.toString(), name));

    // Empty value
    client.HSET(key, field1, value2, require_number(0, name));
    client.HGET([key, field1], require_string("", name));

    // Empty key, empty value
    client.HSET([key, field2, value1], require_number(1, name));
    client.HSET(key, field2, value2, last(name, require_number(0, name)));
};

tests.HLEN = function () {
    var key = "test hash",
        field1 = new Buffer("0123456789"),
        value1 = new Buffer("abcdefghij"),
        field2 = new Buffer(0),
        value2 = new Buffer(0),
        name = "HSET",
        timeout = 1000;

    client.HSET(key, field1, value1, function (err, results) {
        client.HLEN(key, function (err, len) {
            assert.ok(2 === +len);
            next(name);
        });
    });
};

tests.HMSET_BUFFER_AND_ARRAY = function () {
    // Saving a buffer and an array to the same key should not error
    var key = "test hash",
        field1 = "buffer",
        value1 = new Buffer("abcdefghij"),
        field2 = "array",
        value2 = ["array contents"],
        name = "HSET";

    client.HMSET(key, field1, value1, field2, value2, last(name, require_string("OK", name)));
};

// TODO - add test for HMSET with optional callbacks

tests.HMGET = function () {
    var key1 = "test hash 1", key2 = "test hash 2", key3 = 123456789, name = "HMGET";

    // redis-like hmset syntax
    client.HMSET(key1, "0123456789", "abcdefghij", "some manner of key", "a type of value", require_string("OK", name));

    // fancy hmset syntax
    client.HMSET(key2, {
        "0123456789": "abcdefghij",
        "some manner of key": "a type of value"
    }, require_string("OK", name));

    // test for numeric key
    client.HMSET(key3, {
        "0123456789": "abcdefghij",
        "some manner of key": "a type of value"
    }, require_string("OK", name));

    client.HMGET(key1, "0123456789", "some manner of key", function (err, reply) {
        assert.strictEqual("abcdefghij", reply[0].toString(), name);
        assert.strictEqual("a type of value", reply[1].toString(), name);
    });

    client.HMGET(key2, "0123456789", "some manner of key", function (err, reply) {
        assert.strictEqual("abcdefghij", reply[0].toString(), name);
        assert.strictEqual("a type of value", reply[1].toString(), name);
    });

    client.HMGET(key3, "0123456789", "some manner of key", function (err, reply) {
        assert.strictEqual("abcdefghij", reply[0].toString(), name);
        assert.strictEqual("a type of value", reply[1].toString(), name);
    });

    client.HMGET(key1, ["0123456789"], function (err, reply) {
        assert.strictEqual("abcdefghij", reply[0], name);
    });

    client.HMGET(key1, ["0123456789", "some manner of key"], function (err, reply) {
        assert.strictEqual("abcdefghij", reply[0], name);
        assert.strictEqual("a type of value", reply[1], name);
    });

    client.HMGET(key1, "missing thing", "another missing thing", function (err, reply) {
        assert.strictEqual(null, reply[0], name);
        assert.strictEqual(null, reply[1], name);
        next(name);
    });
};

tests.HINCRBY = function () {
    var name = "HINCRBY";
    client.hset("hash incr", "value", 10, require_number(1, name));
    client.HINCRBY("hash incr", "value", 1, require_number(11, name));
    client.HINCRBY("hash incr", "value 2", 1, last(name, require_number(1, name)));
};

tests.SUBSCRIBE = function () {
    var client1 = client, msg_count = 0, name = "SUBSCRIBE";

    client1.on("subscribe", function (channel, count) {
        if (channel === "chan1") {
            client2.publish("chan1", "message 1", require_number(1, name));
            client2.publish("chan2", "message 2", require_number(1, name));
            client2.publish("chan1", "message 3", require_number(1, name));
        }
    });

    client1.on("unsubscribe", function (channel, count) {
        if (count === 0) {
            // make sure this connection can go into and out of pub/sub mode
            client1.incr("did a thing", last(name, require_number(2, name)));
        }
    });

    client1.on("message", function (channel, message) {
        msg_count += 1;
        assert.strictEqual("message " + msg_count, message.toString());
        if (msg_count === 3) {
            client1.unsubscribe("chan1", "chan2");
        }
    });

    client1.set("did a thing", 1, require_string("OK", name));
    client1.subscribe("chan1", "chan2", function (err, results) {
        assert.strictEqual(null, err, "result sent back unexpected error: " + err);
        assert.strictEqual("chan1", results.toString(), name);
    });
};

tests.UNSUB_EMPTY = function () {
  // test situation where unsubscribe reply[1] is null
  var name = "UNSUB_EMPTY";
  client3.unsubscribe(); // unsubscribe from all so can test null
  client3.unsubscribe(); // reply[1] will be null
  next(name);
};

tests.PUNSUB_EMPTY = function () {
  // test situation where punsubscribe reply[1] is null
  var name = "PUNSUB_EMPTY";
  client3.punsubscribe(); // punsubscribe from all so can test null
  client3.punsubscribe(); // reply[1] will be null
  next(name);
};

tests.UNSUB_EMPTY_CB = function () {
  var name = "UNSUB_EMPTY_CB";
  // test hangs on older versions of redis, so skip
  if (!server_version_at_least(client, [2, 6, 11])) return next(name);

  // test situation where unsubscribe reply[1] is null
  client3.unsubscribe(); // unsubscribe from all so can test null
  client3.unsubscribe(function (err, results) {
      // reply[1] will be null
      assert.strictEqual(null, err, "unexpected error: " + err);
      next(name);
  });
};

tests.PUNSUB_EMPTY_CB = function () {
  var name = "PUNSUB_EMPTY_CB";
  // test hangs on older versions of redis, so skip
  if (!server_version_at_least(client, [2, 6, 11])) return next(name);

  // test situation where punsubscribe reply[1] is null
  client3.punsubscribe(); // punsubscribe from all so can test null
  client3.punsubscribe(function (err, results) {
      // reply[1] will be null
      assert.strictEqual(null, err, "unexpected error: " + err);
      next(name);
  });
};

tests.SUB_UNSUB_SUB = function () {
    var name = "SUB_UNSUB_SUB";
    // test hangs on older versions of redis, so skip
    if (!server_version_at_least(client, [2, 6, 11])) return next(name);

    client3.subscribe('chan3');
    client3.unsubscribe('chan3');
    client3.subscribe('chan3', function (err, results) {
        assert.strictEqual(null, err, "unexpected error: " + err);
        client2.publish('chan3', 'foo');
    });
    client3.on('message', function (channel, message) {
        assert.strictEqual(channel, 'chan3');
        assert.strictEqual(message, 'foo');
        client3.removeAllListeners();
        next(name);
    });
};

tests.SUB_UNSUB_MSG_SUB = function () {
    var name = "SUB_UNSUB_MSG_SUB";
    // test hangs on older versions of redis, so skip
    if (!server_version_at_least(client, [2, 6, 11])) return next(name);

    client3.subscribe('chan8');
    client3.subscribe('chan9');
    client3.unsubscribe('chan9');
    client2.publish('chan8', 'something');
    client3.subscribe('chan9', with_timeout(name, function (err, results) {
        next(name);
    }, 2000));
};

tests.PSUB_UNSUB_PMSG_SUB = function () {
    var name = "PSUB_UNSUB_PMSG_SUB";
    // test hangs on older versions of redis, so skip
    if (!server_version_at_least(client, [2, 6, 11])) return next(name);

    client3.psubscribe('abc*');
    client3.subscribe('xyz');
    client3.unsubscribe('xyz');
    client2.publish('abcd', 'something');
    client3.subscribe('xyz', with_timeout(name, function (err, results) {
        next(name);
    }, 2000));
};

tests.SUBSCRIBE_QUIT = function () {
    var name = "SUBSCRIBE_QUIT";
    client3.on("end", function () {
        next(name);
    });
    client3.on("subscribe", function (channel, count) {
        client3.quit();
    });
    client3.subscribe("chan3");
};

tests.SUBSCRIBE_CLOSE_RESUBSCRIBE = function () {
    var name = "SUBSCRIBE_CLOSE_RESUBSCRIBE";
    var c1 = redis.createClient({ parser: parser });
    var c2 = redis.createClient({ parser: parser });
    var count = 0;

    /* Create two clients. c1 subscribes to two channels, c2 will publish to them.
       c2 publishes the first message.
       c1 gets the message and drops its connection. It must resubscribe itself.
       When it resubscribes, c2 publishes the second message, on the same channel
       c1 gets the message and drops its connection. It must resubscribe itself, again.
       When it resubscribes, c2 publishes the third message, on the second channel
       c1 gets the message and drops its connection. When it reconnects, the test ends.
    */

    c1.on("message", function(channel, message) {
        if (channel === "chan1") {
            assert.strictEqual(message, "hi on channel 1");
            c1.stream.end();

        } else if (channel === "chan2") {
            assert.strictEqual(message, "hi on channel 2");
            c1.stream.end();

        } else {
            c1.quit();
            c2.quit();
            assert.fail("test failed");
        }
    });

    c1.subscribe("chan1", "chan2");

    c2.once("ready", function() {
        console.log("c2 is ready");
        c1.on("ready", function(err, results) {
            console.log("c1 is ready", count);

            count++;
            if (count == 1) {
                c2.publish("chan1", "hi on channel 1");
                return;

            } else if (count == 2) {
                c2.publish("chan2", "hi on channel 2");

            } else {
                c1.quit(function() {
                    c2.quit(function() {
                        next(name);
                    });
                });
            }
        });

        c2.publish("chan1", "hi on channel 1");

    });
};

tests.EXISTS = function () {
    var name = "EXISTS";
    client.del("foo", "foo2", require_number_any(name));
    client.set("foo", "bar", require_string("OK", name));
    client.EXISTS("foo", require_number(1, name));
    client.EXISTS("foo2", last(name, require_number(0, name)));
};

tests.DEL = function () {
    var name = "DEL";
    client.DEL("delkey", require_number_any(name));
    client.set("delkey", "delvalue", require_string("OK", name));
    client.DEL("delkey", require_number(1, name));
    client.exists("delkey", require_number(0, name));
    client.DEL("delkey", require_number(0, name));
    client.mset("delkey", "delvalue", "delkey2", "delvalue2", require_string("OK", name));
    client.DEL("delkey", "delkey2", last(name, require_number(2, name)));
};

tests.TYPE = function () {
    var name = "TYPE";
    client.set(["string key", "should be a string"], require_string("OK", name));
    client.rpush(["list key", "should be a list"], require_number_pos(name));
    client.sadd(["set key", "should be a set"], require_number_any(name));
    client.zadd(["zset key", "10.0", "should be a zset"], require_number_any(name));
    client.hset(["hash key", "hashtest", "should be a hash"], require_number_any(0, name));

    client.TYPE(["string key"], require_string("string", name));
    client.TYPE(["list key"], require_string("list", name));
    client.TYPE(["set key"], require_string("set", name));
    client.TYPE(["zset key"], require_string("zset", name));
    client.TYPE("not here yet", require_string("none", name));
    client.TYPE(["hash key"], last(name, require_string("hash", name)));
};

tests.KEYS = function () {
    var name = "KEYS";
    client.mset(["test keys 1", "test val 1", "test keys 2", "test val 2"], require_string("OK", name));
    client.KEYS(["test keys*"], function (err, results) {
        assert.strictEqual(null, err, "result sent back unexpected error: " + err);
        assert.strictEqual(2, results.length, name);
        assert.ok(~results.indexOf("test keys 1"));
        assert.ok(~results.indexOf("test keys 2"));
        next(name);
    });
};

tests.MULTIBULK = function() {
    var name = "MULTIBULK",
        keys_values = [];

    for (var i = 0; i < 200; i++) {
        var key_value = [
            "multibulk:" + crypto.randomBytes(256).toString("hex"), // use long strings as keys to ensure generation of large packet
            "test val " + i
        ];
        keys_values.push(key_value);
    }

    client.mset(keys_values.reduce(function(a, b) {
        return a.concat(b);
    }), require_string("OK", name));

    client.KEYS("multibulk:*", function(err, results) {
        assert.strictEqual(null, err, "result sent back unexpected error: " + err);
        assert.deepEqual(keys_values.map(function(val) {
            return val[0];
        }).sort(), results.sort(), name);
    });

    next(name);
};

tests.MULTIBULK_ZERO_LENGTH = function () {
    var name = "MULTIBULK_ZERO_LENGTH";
    client.KEYS(['users:*'], function (err, results) {
        assert.strictEqual(null, err, 'error on empty multibulk reply');
        assert.strictEqual(true, is_empty_array(results), "not an empty array");
        next(name);
    });
};

tests.RANDOMKEY = function () {
    var name = "RANDOMKEY";
    client.mset(["test keys 1", "test val 1", "test keys 2", "test val 2"], require_string("OK", name));
    client.RANDOMKEY([], function (err, results) {
        assert.strictEqual(null, err, name + " result sent back unexpected error: " + err);
        assert.strictEqual(true, /\w+/.test(results), name);
        next(name);
    });
};

tests.RENAME = function () {
    var name = "RENAME";
    client.set(['foo', 'bar'], require_string("OK", name));
    client.RENAME(["foo", "new foo"], require_string("OK", name));
    client.exists(["foo"], require_number(0, name));
    client.exists(["new foo"], last(name, require_number(1, name)));
};

tests.RENAMENX = function () {
    var name = "RENAMENX";
    client.set(['foo', 'bar'], require_string("OK", name));
    client.set(['foo2', 'bar2'], require_string("OK", name));
    client.RENAMENX(["foo", "foo2"], require_number(0, name));
    client.exists(["foo"], require_number(1, name));
    client.exists(["foo2"], require_number(1, name));
    client.del(["foo2"], require_number(1, name));
    client.RENAMENX(["foo", "foo2"], require_number(1, name));
    client.exists(["foo"], require_number(0, name));
    client.exists(["foo2"], last(name, require_number(1, name)));
};

tests.DBSIZE = function () {
    var name = "DBSIZE";
    client.set(['foo', 'bar'], require_string("OK", name));
    client.DBSIZE([], last(name, require_number_pos("DBSIZE")));
};

tests.GET_1 = function () {
    var name = "GET_1";
    client.set(["get key", "get val"], require_string("OK", name));
    client.GET(["get key"], last(name, require_string("get val", name)));
};

tests.GET_2 = function() {
    var name = "GET_2";

    // tests handling of non-existent keys
    client.GET('this_key_shouldnt_exist', last(name, require_null(name)));
};

tests.SET = function () {
    var name = "SET";
    client.SET(["set key", "set val"], require_string("OK", name));
    client.get(["set key"], last(name, require_string("set val", name)));
    client.SET(["set key", undefined], require_error(name));
};

tests.GETSET = function () {
    var name = "GETSET";
    client.set(["getset key", "getset val"], require_string("OK", name));
    client.GETSET(["getset key", "new getset val"], require_string("getset val", name));
    client.get(["getset key"], last(name, require_string("new getset val", name)));
};

tests.MGET = function () {
    var name = "MGET";
    client.mset(["mget keys 1", "mget val 1", "mget keys 2", "mget val 2", "mget keys 3", "mget val 3"], require_string("OK", name));
    client.MGET("mget keys 1", "mget keys 2", "mget keys 3", function (err, results) {
        assert.strictEqual(null, err, "result sent back unexpected error: " + err);
        assert.strictEqual(3, results.length, name);
        assert.strictEqual("mget val 1", results[0].toString(), name);
        assert.strictEqual("mget val 2", results[1].toString(), name);
        assert.strictEqual("mget val 3", results[2].toString(), name);
    });
    client.MGET(["mget keys 1", "mget keys 2", "mget keys 3"], function (err, results) {
        assert.strictEqual(null, err, "result sent back unexpected error: " + err);
        assert.strictEqual(3, results.length, name);
        assert.strictEqual("mget val 1", results[0].toString(), name);
        assert.strictEqual("mget val 2", results[1].toString(), name);
        assert.strictEqual("mget val 3", results[2].toString(), name);
    });
    client.MGET(["mget keys 1", "some random shit", "mget keys 2", "mget keys 3"], function (err, results) {
        assert.strictEqual(null, err, "result sent back unexpected error: " + err);
        assert.strictEqual(4, results.length, name);
        assert.strictEqual("mget val 1", results[0].toString(), name);
        assert.strictEqual(null, results[1], name);
        assert.strictEqual("mget val 2", results[2].toString(), name);
        assert.strictEqual("mget val 3", results[3].toString(), name);
        next(name);
    });
};

tests.SETNX = function () {
    var name = "SETNX";
    client.set(["setnx key", "setnx value"], require_string("OK", name));
    client.SETNX(["setnx key", "new setnx value"], require_number(0, name));
    client.del(["setnx key"], require_number(1, name));
    client.exists(["setnx key"], require_number(0, name));
    client.SETNX(["setnx key", "new setnx value"], require_number(1, name));
    client.exists(["setnx key"], last(name, require_number(1, name)));
};

tests.SETEX = function () {
    var name = "SETEX";
    client.SETEX(["setex key", "100", "setex val"], require_string("OK", name));
    client.exists(["setex key"], require_number(1, name));
    client.ttl(["setex key"], last(name, require_number_pos(name)));
    client.SETEX(["setex key", "100", undefined], require_error(name));
};

tests.MSETNX = function () {
    var name = "MSETNX";
    client.mset(["mset1", "val1", "mset2", "val2", "mset3", "val3"], require_string("OK", name));
    client.MSETNX(["mset3", "val3", "mset4", "val4"], require_number(0, name));
    client.del(["mset3"], require_number(1, name));
    client.MSETNX(["mset3", "val3", "mset4", "val4"], require_number(1, name));
    client.exists(["mset3"], require_number(1, name));
    client.exists(["mset4"], last(name, require_number(1, name)));
};

tests.HGETALL = function () {
    var name = "HGETALL";
    client.hmset(["hosts", "mjr", "1", "another", "23", "home", "1234"], require_string("OK", name));
    client.HGETALL(["hosts"], function (err, obj) {
        assert.strictEqual(null, err, name + " result sent back unexpected error: " + err);
        assert.strictEqual(3, Object.keys(obj).length, name);
        assert.strictEqual("1", obj.mjr.toString(), name);
        assert.strictEqual("23", obj.another.toString(), name);
        assert.strictEqual("1234", obj.home.toString(), name);
        next(name);
    });
};

tests.HGETALL_2 = function () {
    var name = "HGETALL (Binary client)";
    bclient.hmset(["bhosts", "mjr", "1", "another", "23", "home", "1234", new Buffer([0xAA, 0xBB, 0x00, 0xF0]), new Buffer([0xCC, 0xDD, 0x00, 0xF0])], require_string("OK", name));
    bclient.HGETALL(["bhosts"], function (err, obj) {
        assert.strictEqual(null, err, name + " result sent back unexpected error: " + err);
        assert.strictEqual(4, Object.keys(obj).length, name);
        assert.strictEqual("1", obj.mjr.toString(), name);
        assert.strictEqual("23", obj.another.toString(), name);
        assert.strictEqual("1234", obj.home.toString(), name);
        assert.strictEqual((new Buffer([0xAA, 0xBB, 0x00, 0xF0])).toString('binary'), Object.keys(obj)[3], name);
        assert.strictEqual((new Buffer([0xCC, 0xDD, 0x00, 0xF0])).toString('binary'), obj[(new Buffer([0xAA, 0xBB, 0x00, 0xF0])).toString('binary')].toString('binary'), name);
        next(name);
    });
};

tests.HGETALL_MESSAGE = function () {
    var name = "HGETALL_MESSAGE";
    client.hmset("msg_test", {message: "hello"}, require_string("OK", name));
    client.hgetall("msg_test", function (err, obj) {
        assert.strictEqual(null, err, name + " result sent back unexpected error: " + err);
        assert.strictEqual(1, Object.keys(obj).length, name);
        assert.strictEqual(obj.message, "hello")
        next(name);
    });
};

tests.HGETALL_NULL = function () {
    var name = "HGETALL_NULL";

    client.hgetall("missing", function (err, obj) {
        assert.strictEqual(null, err);
        assert.strictEqual(null, obj);
        next(name);
    });
};

tests.UTF8 = function () {
    var name = "UTF8",
        utf8_sample = "ಠ_ಠ";

    client.set(["utf8test", utf8_sample], require_string("OK", name));
    client.get(["utf8test"], function (err, obj) {
        assert.strictEqual(null, err);
        assert.strictEqual(utf8_sample, obj);
        next(name);
    });
};

// Set tests were adapted from Brian Hammond's redis-node-client.js, which has a comprehensive test suite

tests.SADD = function () {
    var name = "SADD";

    client.del('set0');
    client.SADD('set0', 'member0', require_number(1, name));
    client.sadd('set0', 'member0', last(name, require_number(0, name)));
};

tests.SADD2 = function () {
    var name = "SADD2";

    client.del("set0");
    client.sadd("set0", ["member0", "member1", "member2"], require_number(3, name));
    client.smembers("set0", function (err, res) {
        assert.strictEqual(res.length, 3);
        assert.ok(~res.indexOf("member0"));
        assert.ok(~res.indexOf("member1"));
        assert.ok(~res.indexOf("member2"));
    });
    client.SADD("set1", ["member0", "member1", "member2"], require_number(3, name));
    client.smembers("set1", function (err, res) {
        assert.strictEqual(res.length, 3);
        assert.ok(~res.indexOf("member0"));
        assert.ok(~res.indexOf("member1"));
        assert.ok(~res.indexOf("member2"));
        next(name);
    });
};

tests.SISMEMBER = function () {
    var name = "SISMEMBER";

    client.del('set0');
    client.sadd('set0', 'member0', require_number(1, name));
    client.sismember('set0', 'member0', require_number(1, name));
    client.sismember('set0', 'member1', last(name, require_number(0, name)));
};

tests.SCARD = function () {
    var name = "SCARD";

    client.del('set0');
    client.sadd('set0', 'member0', require_number(1, name));
    client.scard('set0', require_number(1, name));
    client.sadd('set0', 'member1', require_number(1, name));
    client.scard('set0', last(name, require_number(2, name)));
};

tests.SREM = function () {
    var name = "SREM";

    client.del('set0');
    client.sadd('set0', 'member0', require_number(1, name));
    client.srem('set0', 'foobar', require_number(0, name));
    client.srem('set0', 'member0', require_number(1, name));
    client.scard('set0', last(name, require_number(0, name)));
};


tests.SREM2 = function () {
    var name = "SREM2";
    client.del("set0");
    client.sadd("set0", ["member0", "member1", "member2"], require_number(3, name));
    client.SREM("set0", ["member1", "member2"], require_number(2, name));
    client.smembers("set0", function (err, res) {
        assert.strictEqual(res.length, 1);
        assert.ok(~res.indexOf("member0"));
    });
    client.sadd("set0", ["member3", "member4", "member5"], require_number(3, name));
    client.srem("set0", ["member0", "member6"], require_number(1, name));
    client.smembers("set0", function (err, res) {
        assert.strictEqual(res.length, 3);
        assert.ok(~res.indexOf("member3"));
        assert.ok(~res.indexOf("member4"));
        assert.ok(~res.indexOf("member5"));
        next(name);
    });
};

tests.SPOP = function () {
    var name = "SPOP";

    client.del('zzz');
    client.sadd('zzz', 'member0', require_number(1, name));
    client.scard('zzz', require_number(1, name));

    client.spop('zzz', function (err, value) {
        if (err) {
            assert.fail(err);
        }
        assert.equal(value, 'member0', name);
    });

    client.scard('zzz', last(name, require_number(0, name)));
};

tests.SDIFF = function () {
    var name = "SDIFF";

    client.del('foo');
    client.sadd('foo', 'x', require_number(1, name));
    client.sadd('foo', 'a', require_number(1, name));
    client.sadd('foo', 'b', require_number(1, name));
    client.sadd('foo', 'c', require_number(1, name));

    client.sadd('bar', 'c', require_number(1, name));

    client.sadd('baz', 'a', require_number(1, name));
    client.sadd('baz', 'd', require_number(1, name));

    client.sdiff('foo', 'bar', 'baz', function (err, values) {
        if (err) {
            assert.fail(err, name);
        }
        values.sort();
        assert.equal(values.length, 2, name);
        assert.equal(values[0], 'b', name);
        assert.equal(values[1], 'x', name);
        next(name);
    });
};

tests.SDIFFSTORE = function () {
    var name = "SDIFFSTORE";

    client.del('foo');
    client.del('bar');
    client.del('baz');
    client.del('quux');

    client.sadd('foo', 'x', require_number(1, name));
    client.sadd('foo', 'a', require_number(1, name));
    client.sadd('foo', 'b', require_number(1, name));
    client.sadd('foo', 'c', require_number(1, name));

    client.sadd('bar', 'c', require_number(1, name));

    client.sadd('baz', 'a', require_number(1, name));
    client.sadd('baz', 'd', require_number(1, name));

    // NB: SDIFFSTORE returns the number of elements in the dstkey

    client.sdiffstore('quux', 'foo', 'bar', 'baz', require_number(2, name));

    client.smembers('quux', function (err, values) {
        if (err) {
            assert.fail(err, name);
        }
        var members = buffers_to_strings(values).sort();

        assert.deepEqual(members, [ 'b', 'x' ], name);
        next(name);
    });
};

tests.SMEMBERS = function () {
    var name = "SMEMBERS";

    client.del('foo');
    client.sadd('foo', 'x', require_number(1, name));

    client.smembers('foo', function (err, members) {
        if (err) {
            assert.fail(err, name);
        }
        assert.deepEqual(buffers_to_strings(members), [ 'x' ], name);
    });

    client.sadd('foo', 'y', require_number(1, name));

    client.smembers('foo', function (err, values) {
        if (err) {
            assert.fail(err, name);
        }
        assert.equal(values.length, 2, name);
        var members = buffers_to_strings(values).sort();

        assert.deepEqual(members, [ 'x', 'y' ], name);
        next(name);
    });
};

tests.SMOVE = function () {
    var name = "SMOVE";

    client.del('foo');
    client.del('bar');

    client.sadd('foo', 'x', require_number(1, name));
    client.smove('foo', 'bar', 'x', require_number(1, name));
    client.sismember('foo', 'x', require_number(0, name));
    client.sismember('bar', 'x', require_number(1, name));
    client.smove('foo', 'bar', 'x', last(name, require_number(0, name)));
};

tests.SINTER = function () {
    var name = "SINTER";

    client.del('sa');
    client.del('sb');
    client.del('sc');

    client.sadd('sa', 'a', require_number(1, name));
    client.sadd('sa', 'b', require_number(1, name));
    client.sadd('sa', 'c', require_number(1, name));

    client.sadd('sb', 'b', require_number(1, name));
    client.sadd('sb', 'c', require_number(1, name));
    client.sadd('sb', 'd', require_number(1, name));

    client.sadd('sc', 'c', require_number(1, name));
    client.sadd('sc', 'd', require_number(1, name));
    client.sadd('sc', 'e', require_number(1, name));

    client.sinter('sa', 'sb', function (err, intersection) {
        if (err) {
            assert.fail(err, name);
        }
        assert.equal(intersection.length, 2, name);
        assert.deepEqual(buffers_to_strings(intersection).sort(), [ 'b', 'c' ], name);
    });

    client.sinter('sb', 'sc', function (err, intersection) {
        if (err) {
            assert.fail(err, name);
        }
        assert.equal(intersection.length, 2, name);
        assert.deepEqual(buffers_to_strings(intersection).sort(), [ 'c', 'd' ], name);
    });

    client.sinter('sa', 'sc', function (err, intersection) {
        if (err) {
            assert.fail(err, name);
        }
        assert.equal(intersection.length, 1, name);
        assert.equal(intersection[0], 'c', name);
    });

    // 3-way

    client.sinter('sa', 'sb', 'sc', function (err, intersection) {
        if (err) {
            assert.fail(err, name);
        }
        assert.equal(intersection.length, 1, name);
        assert.equal(intersection[0], 'c', name);
        next(name);
    });
};

tests.SINTERSTORE = function () {
    var name = "SINTERSTORE";

    client.del('sa');
    client.del('sb');
    client.del('sc');
    client.del('foo');

    client.sadd('sa', 'a', require_number(1, name));
    client.sadd('sa', 'b', require_number(1, name));
    client.sadd('sa', 'c', require_number(1, name));

    client.sadd('sb', 'b', require_number(1, name));
    client.sadd('sb', 'c', require_number(1, name));
    client.sadd('sb', 'd', require_number(1, name));

    client.sadd('sc', 'c', require_number(1, name));
    client.sadd('sc', 'd', require_number(1, name));
    client.sadd('sc', 'e', require_number(1, name));

    client.sinterstore('foo', 'sa', 'sb', 'sc', require_number(1, name));

    client.smembers('foo', function (err, members) {
        if (err) {
            assert.fail(err, name);
        }
        assert.deepEqual(buffers_to_strings(members), [ 'c' ], name);
        next(name);
    });
};

tests.SUNION = function () {
    var name = "SUNION";

    client.del('sa');
    client.del('sb');
    client.del('sc');

    client.sadd('sa', 'a', require_number(1, name));
    client.sadd('sa', 'b', require_number(1, name));
    client.sadd('sa', 'c', require_number(1, name));

    client.sadd('sb', 'b', require_number(1, name));
    client.sadd('sb', 'c', require_number(1, name));
    client.sadd('sb', 'd', require_number(1, name));

    client.sadd('sc', 'c', require_number(1, name));
    client.sadd('sc', 'd', require_number(1, name));
    client.sadd('sc', 'e', require_number(1, name));

    client.sunion('sa', 'sb', 'sc', function (err, union) {
        if (err) {
            assert.fail(err, name);
        }
        assert.deepEqual(buffers_to_strings(union).sort(), ['a', 'b', 'c', 'd', 'e'], name);
        next(name);
    });
};

tests.SUNIONSTORE = function () {
    var name = "SUNIONSTORE";

    client.del('sa');
    client.del('sb');
    client.del('sc');
    client.del('foo');

    client.sadd('sa', 'a', require_number(1, name));
    client.sadd('sa', 'b', require_number(1, name));
    client.sadd('sa', 'c', require_number(1, name));

    client.sadd('sb', 'b', require_number(1, name));
    client.sadd('sb', 'c', require_number(1, name));
    client.sadd('sb', 'd', require_number(1, name));

    client.sadd('sc', 'c', require_number(1, name));
    client.sadd('sc', 'd', require_number(1, name));
    client.sadd('sc', 'e', require_number(1, name));

    client.sunionstore('foo', 'sa', 'sb', 'sc', function (err, cardinality) {
        if (err) {
            assert.fail(err, name);
        }
        assert.equal(cardinality, 5, name);
    });

    client.smembers('foo', function (err, members) {
        if (err) {
            assert.fail(err, name);
        }
        assert.equal(members.length, 5, name);
        assert.deepEqual(buffers_to_strings(members).sort(), ['a', 'b', 'c', 'd', 'e'], name);
        next(name);
    });
};

// SORT test adapted from Brian Hammond's redis-node-client.js, which has a comprehensive test suite

tests.SORT = function () {
    var name = "SORT";

    client.del('y');
    client.del('x');

    client.rpush('y', 'd', require_number(1, name));
    client.rpush('y', 'b', require_number(2, name));
    client.rpush('y', 'a', require_number(3, name));
    client.rpush('y', 'c', require_number(4, name));

    client.rpush('x', '3', require_number(1, name));
    client.rpush('x', '9', require_number(2, name));
    client.rpush('x', '2', require_number(3, name));
    client.rpush('x', '4', require_number(4, name));

    client.set('w3', '4', require_string("OK", name));
    client.set('w9', '5', require_string("OK", name));
    client.set('w2', '12', require_string("OK", name));
    client.set('w4', '6', require_string("OK", name));

    client.set('o2', 'buz', require_string("OK", name));
    client.set('o3', 'foo', require_string("OK", name));
    client.set('o4', 'baz', require_string("OK", name));
    client.set('o9', 'bar', require_string("OK", name));

    client.set('p2', 'qux', require_string("OK", name));
    client.set('p3', 'bux', require_string("OK", name));
    client.set('p4', 'lux', require_string("OK", name));
    client.set('p9', 'tux', require_string("OK", name));

    // Now the data has been setup, we can test.

    // But first, test basic sorting.

    // y = [ d b a c ]
    // sort y ascending = [ a b c d ]
    // sort y descending = [ d c b a ]

    client.sort('y', 'asc', 'alpha', function (err, sorted) {
        if (err) {
            assert.fail(err, name);
        }
        assert.deepEqual(buffers_to_strings(sorted), ['a', 'b', 'c', 'd'], name);
    });

    client.sort('y', 'desc', 'alpha', function (err, sorted) {
        if (err) {
            assert.fail(err, name);
        }
        assert.deepEqual(buffers_to_strings(sorted), ['d', 'c', 'b', 'a'], name);
    });

    // Now try sorting numbers in a list.
    // x = [ 3, 9, 2, 4 ]

    client.sort('x', 'asc', function (err, sorted) {
        if (err) {
            assert.fail(err, name);
        }
        assert.deepEqual(buffers_to_strings(sorted), [2, 3, 4, 9], name);
    });

    client.sort('x', 'desc', function (err, sorted) {
        if (err) {
            assert.fail(err, name);
        }
        assert.deepEqual(buffers_to_strings(sorted), [9, 4, 3, 2], name);
    });

    // Try sorting with a 'by' pattern.

    client.sort('x', 'by', 'w*', 'asc', function (err, sorted) {
        if (err) {
            assert.fail(err, name);
        }
        assert.deepEqual(buffers_to_strings(sorted), [3, 9, 4, 2], name);
    });

    // Try sorting with a 'by' pattern and 1 'get' pattern.

    client.sort('x', 'by', 'w*', 'asc', 'get', 'o*', function (err, sorted) {
        if (err) {
            assert.fail(err, name);
        }
        assert.deepEqual(buffers_to_strings(sorted), ['foo', 'bar', 'baz', 'buz'], name);
    });

    // Try sorting with a 'by' pattern and 2 'get' patterns.

    client.sort('x', 'by', 'w*', 'asc', 'get', 'o*', 'get', 'p*', function (err, sorted) {
        if (err) {
            assert.fail(err, name);
        }
        assert.deepEqual(buffers_to_strings(sorted), ['foo', 'bux', 'bar', 'tux', 'baz', 'lux', 'buz', 'qux'], name);
    });

    // Try sorting with a 'by' pattern and 2 'get' patterns.
    // Instead of getting back the sorted set/list, store the values to a list.
    // Then check that the values are there in the expected order.

    client.sort('x', 'by', 'w*', 'asc', 'get', 'o*', 'get', 'p*', 'store', 'bacon', function (err) {
        if (err) {
            assert.fail(err, name);
        }
    });

    client.lrange('bacon', 0, -1, function (err, values) {
        if (err) {
            assert.fail(err, name);
        }
        assert.deepEqual(buffers_to_strings(values), ['foo', 'bux', 'bar', 'tux', 'baz', 'lux', 'buz', 'qux'], name);
        next(name);
    });

    // TODO - sort by hash value
};

tests.MONITOR = function () {
    var name = "MONITOR", responses = [], monitor_client;

    if (!server_version_at_least(client, [2, 6, 0])) {
        console.log("Skipping " + name + " for old Redis server version < 2.6.x");
        return next(name);
    }

    monitor_client = redis.createClient({ parser: parser });
    monitor_client.monitor(function (err, res) {
        client.mget("some", "keys", "foo", "bar");
        client.set("json", JSON.stringify({
            foo: "123",
            bar: "sdflkdfsjk",
            another: false
        }));
    });
    monitor_client.on("monitor", function (time, args) {
        // skip monitor command for Redis <= 2.4.16
        if (args[0] === "monitor") return;

        responses.push(args);
        if (responses.length === 2) {
            assert.strictEqual(5, responses[0].length);
            assert.strictEqual("mget", responses[0][0]);
            assert.strictEqual("some", responses[0][1]);
            assert.strictEqual("keys", responses[0][2]);
            assert.strictEqual("foo", responses[0][3]);
            assert.strictEqual("bar", responses[0][4]);
            assert.strictEqual(3, responses[1].length);
            assert.strictEqual("set", responses[1][0]);
            assert.strictEqual("json", responses[1][1]);
            assert.strictEqual('{"foo":"123","bar":"sdflkdfsjk","another":false}', responses[1][2]);
            monitor_client.quit(function (err, res) {
                next(name);
            });
        }
    });
};

tests.BLPOP = function () {
    var name = "BLPOP";

    client.rpush("blocking list", "initial value", function (err, res) {
        client2.BLPOP("blocking list", 0, function (err, res) {
            assert.strictEqual("blocking list", res[0].toString());
            assert.strictEqual("initial value", res[1].toString());

            client.rpush("blocking list", "wait for this value");
        });
        client2.BLPOP("blocking list", 0, function (err, res) {
            assert.strictEqual("blocking list", res[0].toString());
            assert.strictEqual("wait for this value", res[1].toString());
            next(name);
        });
    });
};

tests.BLPOP_TIMEOUT = function () {
    var name = "BLPOP_TIMEOUT";

    // try to BLPOP the list again, which should be empty.  This should timeout and return null.
    client2.BLPOP("blocking list", 1, function (err, res) {
        if (err) {
            throw err;
        }

        assert.strictEqual(res, null);
        next(name);
    });
};

tests.EXPIRE = function () {
    var name = "EXPIRE";
    client.set(['expiry key', 'bar'], require_string("OK", name));
    client.EXPIRE(["expiry key", "1"], require_number_pos(name));
    setTimeout(function () {
        client.exists(["expiry key"], last(name, require_number(0, name)));
    }, 2000);
};

tests.TTL = function () {
    var name = "TTL";
    client.set(["ttl key", "ttl val"], require_string("OK", name));
    client.expire(["ttl key", "100"], require_number_pos(name));
    setTimeout(function () {
        client.TTL(["ttl key"], last(name, require_number_pos(0, name)));
    }, 500);
};

tests.OPTIONAL_CALLBACK = function () {
    var name = "OPTIONAL_CALLBACK";
    client.del("op_cb1");
    client.set("op_cb1", "x");
    client.get("op_cb1", last(name, require_string("x", name)));
};

tests.OPTIONAL_CALLBACK_UNDEFINED = function () {
    var name = "OPTIONAL_CALLBACK_UNDEFINED";
    client.del("op_cb2");
    client.set("op_cb2", "y", undefined);
    client.get("op_cb2", last(name, require_string("y", name)));

    client.set("op_cb_undefined", undefined, undefined);
};

tests.ENABLE_OFFLINE_QUEUE_TRUE = function () {
    var name = "ENABLE_OFFLINE_QUEUE_TRUE";
    var cli = redis.createClient(9999, null, {
        max_attempts: 1,
        parser: parser
        // default :)
        // enable_offline_queue: true
    });
    cli.on('error', function(e) {
        // ignore, b/c expecting a "can't connect" error
    });
    return setTimeout(function() {
        cli.set(name, name, function(err, result) {
            assert.ifError(err);
        });

        return setTimeout(function(){
            assert.strictEqual(cli.offline_queue.length, 1);
            return next(name);
        }, 25);
    }, 50);
};

tests.ENABLE_OFFLINE_QUEUE_FALSE = function () {
    var name = "ENABLE_OFFLINE_QUEUE_FALSE";
    var cli = redis.createClient(9999, null, {
        parser: parser,
        max_attempts: 1,
        enable_offline_queue: false
    });
    cli.on('error', function() {
        // ignore, see above
    });
    assert.throws(function () {
        cli.set(name, name)
    })
    assert.doesNotThrow(function () {
        cli.set(name, name, function (err) {
            // should callback with an error
            assert.ok(err);
            setTimeout(function () {
                next(name);
            }, 50);
        });
    });
};

tests.SLOWLOG = function () {
    var name = "SLOWLOG";
    client.config("set", "slowlog-log-slower-than", 0, require_string("OK", name));
    client.slowlog("reset", require_string("OK", name));
    client.set("foo", "bar", require_string("OK", name));
    client.get("foo", require_string("bar", name));
    client.slowlog("get", function (err, res) {
        assert.equal(res.length, 3, name);
        assert.equal(res[0][3].length, 2, name);
        assert.deepEqual(res[1][3], ["set", "foo", "bar"], name);
        assert.deepEqual(res[2][3], ["slowlog", "reset"], name);
        client.config("set", "slowlog-log-slower-than", 10000, require_string("OK", name));
        next(name);
    });
}

tests.DOMAIN = function () {
    var name = "DOMAIN";

    var domain;
    try {
        domain = require('domain').create();
    } catch (err) {
        console.log("Skipping " + name + " because this version of node doesn't have domains.");
        next(name);
    }

    if (domain) {
        domain.run(function () {
            client.set('domain', 'value', function (err, res) {
                assert.ok(process.domain);
                var notFound = res.not.existing.thing; // ohhh nooooo
            });
        });

        // this is the expected and desired behavior
        domain.on('error', function (err) {
          domain.exit();
          next(name);
        });
    }
};

// TODO - need a better way to test auth, maybe auto-config a local Redis server or something.
// Yes, this is the real password.  Please be nice, thanks.
tests.auth = function () {
    var name = "AUTH", client4, ready_count = 0;

    client4 = redis.createClient(9006, "filefish.redistogo.com", { parser: parser });
    client4.auth("664b1b6aaf134e1ec281945a8de702a9", function (err, res) {
        assert.strictEqual(null, err, name);
        assert.strictEqual("OK", res.toString(), name);
    });

    // test auth, then kill the connection so it'll auto-reconnect and auto-re-auth
    client4.on("ready", function () {
        ready_count++;
        if (ready_count === 1) {
            client4.stream.destroy();
        } else {
            client4.quit(function (err, res) {
                next(name);
            });
        }
    });
};

tests.auth2 = function () {
    var name = "AUTH2", client4, ready_count = 0;

    client4 = redis.createClient(9006, "filefish.redistogo.com", { auth_pass: "664b1b6aaf134e1ec281945a8de702a9", parser: parser });

    // test auth, then kill the connection so it'll auto-reconnect and auto-re-auth
    client4.on("ready", function () {
        ready_count++;
        if (ready_count === 1) {
            client4.stream.destroy();
        } else {
            client4.quit(function (err, res) {
                next(name);
            });
        }
    });
};

// auth password specified by URL string.
tests.auth3 = function () {
    var name = "AUTH3", client4, ready_count = 0;

    client4 = redis.createClient('redis://redistogo:664b1b6aaf134e1ec281945a8de702a9@filefish.redistogo.com:9006/');

    // test auth, then kill the connection so it'll auto-reconnect and auto-re-auth
    client4.on("ready", function () {
        ready_count++;
        if (ready_count === 1) {
            client4.stream.destroy();
        } else {
            client4.quit(function (err, res) {
                next(name);
            });
        }
    });
};

tests.reconnectRetryMaxDelay = function() {
    var time = new Date().getTime(),
        name = 'reconnectRetryMaxDelay',
        reconnecting = false;
    var client = redis.createClient(PORT, HOST, {
        retry_max_delay: 1,
        parser: parser
    });
    client.on('ready', function() {
        if (!reconnecting) {
            reconnecting = true;
            client.retry_delay = 1000;
            client.retry_backoff = 1;
            client.stream.end();
        } else {
            client.end();
            var lasted = new Date().getTime() - time;
            assert.ok(lasted < 1000);
            next(name);
        }
    });
};

tests.unref = function () {
    var name = "unref";
    var external = fork("./test/test-unref.js");
    var done = false;
    external.on("close", function (code) {
        assert(code == 0, "test-unref.js failed");
        done = true;
    })
    setTimeout(function () {
        if (!done) {
            external.kill();
        }
        assert(done, "test-unref.js didn't finish in time.");
        next(name);
    }, 1500);
};

// starting to split tests into multiple files.
require('./queue-test')(tests, next)

all_tests = Object.keys(tests);
all_start = new Date();
test_count = 0;

run_next_test = function run_next_test() {
    var test_name = all_tests.shift();
    if (typeof tests[test_name] === "function") {
        util.print('- \x1b[1m' + test_name.toLowerCase() + '\x1b[0m:');
        cur_start = new Date();
        test_count += 1;
        tests[test_name]();
    } else {
        console.log('\n  completed \x1b[32m%d\x1b[0m tests in \x1b[33m%d\x1b[0m ms\n', test_count, new Date() - all_start);
        client.quit();
        client2.quit();
        bclient.quit();
    }
};

client.once("ready", function start_tests() {
    console.log("Connected to " + client.address + ", Redis server version " + client.server_info.redis_version + "\n");
    console.log("Using reply parser " + client.reply_parser.name);

    run_next_test();

    connected = true;
});

client.on('end', function () {
    ended = true;
});

// Exit immediately on connection failure, which triggers "exit", below, which fails the test
client.on("error", function (err) {
    console.error("client: " + err.stack);
    process.exit();
});
client2.on("error", function (err) {
    console.error("client2: " + err.stack);
    process.exit();
});
client3.on("error", function (err) {
    console.error("client3: " + err.stack);
    process.exit();
});
bclient.on("error", function (err) {
    console.error("bclient: " + err.stack);
    process.exit();
});

client.on("reconnecting", function (params) {
    console.log("reconnecting: " + util.inspect(params));
});

process.on('uncaughtException', function (err) {
    console.error("Uncaught exception: " + err.stack);
    process.exit(1);
});

process.on('exit', function (code) {
    assert.equal(true, connected);
    assert.equal(true, ended);
});
