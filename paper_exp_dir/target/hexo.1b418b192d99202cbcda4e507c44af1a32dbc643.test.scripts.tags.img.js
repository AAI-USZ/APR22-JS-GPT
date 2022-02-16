const $ = cheerio.load(img(['https://placekitten.com/200/300']));
$('img').attr('src').should.eql('https://placekitten.com/200/300');
const $ = cheerio.load(img('left https://placekitten.com/200/300'.split(' ')));
