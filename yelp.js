var yelp = require("yelp").createClient({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET
});

var done;
// See http://www.yelp.com/developers/documentation/v2/search_api
yelp.search({term: "poutine", location: "seattle"}, function(error, data) {
  done = data;
  var doney = done.businesses.map(function(data){
    return [data.name, data.url]
  });
  console.log(doney);
});

// // See http://www.yelp.com/developers/documentation/v2/business
// yelp.business("yelp-san-francisco", function(error, data) {
//   console.log(error);
//   console.log(data);
// });
