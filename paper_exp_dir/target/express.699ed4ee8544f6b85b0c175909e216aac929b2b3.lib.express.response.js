var status = 200;
if (ranges) {
var stream = fs.createReadStream(path, ranges[0]),
