var express = require('express')
	, config = require('./config')
	, Feedly = require('./../lib/feedly-core.js').Feedly
	, OAuth2 = require('oauth').OAuth2;

var app = express();

// A MemoryStore is the default, but you probably want something
// more robust for production use.
var store = new express.session.MemoryStore;
app.use( express.cookieParser() );
app.use(express.session({ secret: 'node-feedly', store: store }));

var error = function (err, response, body) {
	console.log(err);
	res.send('error');
};


app.get('/oauth', function(req, res) {
	res.send(req.session.oauth.access_token);
});


app.get('/', function(req, res) {
	if (req.query.code) {

		var feedly = new Feedly(config);
		feedly.getAccessToken(req.query.code, null, function (err, accessToken) {
			if(err) res.send('error: ' + err.message)

			// add the token to the session
		 	req.session.oauth = {};
			req.session.oauth.access_token = accessToken;
			console.log(req.session.oauth.access_token);

			feedly.accessToken = accessToken;
			feedly.getSubscriptions(null, error, function(data) {
				res.send(data);
			})

		});
	} else {
		res.send('<a href="/provider/feedly">Login</a>');
	}
});

app.get('/streams', function(req, res) {
	var feedly = new Feedly(config);
	feedly.accessToken = req.session.oauth.access_token;
	feedly.getStreamIds({streamId:'feed/http://feeds.feedburner.com/marginalrevolution/feed'}, error, function(data) {
		res.send(data);
	})
})

app.get('/entries', function(req, res) {
	var feedly = new Feedly(config);
	feedly.accessToken = req.session.oauth.access_token;
	feedly.getEntry({entryId:'nBI19M788uPF864Rs16HF0moRJaqTLu+yifpJ4UYFP0=_1410419b9ad:23cb17:18126be2'}, error, function(data) {
		res.send(data);
	})

})


app.get('/provider/feedly', function(req, res) {
	console.log(config);
	var feedly = new Feedly(config);
  var url = feedly.getAuthClientRedirectUrl();
	res.writeHead(303, { 'location': url });
	res.end();
});

app.listen(3000);


// test entry id : NLuEiO1aE4x3Ax6r9TwD9PeWBJI9zd9++BBCwV13+KM=_140f2d5058f
// http://cloud.feedly.com/v3/entries/NLuEiO1aE4x3Ax6r9TwD9PeWBJI9zd9++BBCwV13+KM=_140f2d5058f
//  curl -H "Authorization: OAuth AQAA2DR7ImEiOiJSZWRlZiIsInQiOjEsInYiOiJwcm9kdWN0aW9uIiwieCI6InN0YW5kYXJkIiwicCI6MSwiaSI6IjNkYzVlZjZkLTRkZDItNGQ2Zi1hMTRjLTRhODRkMjNmNTVkNCIsImUiOjEzNzkzNjE1NTYxMTl9" http://cloud.feedly.com/v3/profile

//  curl -H "Authorization: OAuth AQAAcjB7ImEiOiJSZWRlZiIsImkiOiIzZGM1ZWY2ZC00ZGQyLTRkNmYtYTE0Yy00YTg0ZDIzZjU1ZDQiLCJwIjoxLCJ4Ijoic3RhbmRhcmQiLCJ0IjoxLCJ2IjoicHJvZHVjdGlvbiIsImUiOjEzNzkwOTcxODM4ODF9" http://cloud.feedly.com/v3/entries/NLuEiO1aE4x3Ax6r9TwD9PeWBJI9zd9++BBCwV13+KM=_140f2d5058f
