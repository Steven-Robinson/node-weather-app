/* get some weather stats and put em in a sqlite db */

var request = require('request'),

	querystring = require('querystring'),

	sqlite3 = require('sqlite3').verbose(),

	db = new sqlite3.Database('mydb.db'),

	config = require('./config.json'),

	service = 'api.openweathermap.org/data/2.5/weather',

	url = (function (url, params) {
		qs = querystring.stringify(params);
		return 'http://' + url + '?' + qs;
	}(service, config)),

	mybody;

request(url, function (err, res, body) {
	if (!err && res.statusCode == 200) {
		mybody = body;
	}
});

db.serialize(function() {
	if (process.argv[2] == 'reset') {
		db.run("DROP table weather_data");
	}

	db.run("CREATE TABLE if not exists weather_data (data TEXT)");
	
	var stmt = db.prepare("INSERT INTO weather_data (data) VALUES (?)");
	stmt.run();
	stmt.finalize();

	db.each("SELECT rowid AS id, data FROM weather_data", function(err, row) {
		console.log(row.id + ": " + row.data);
	});
});

db.close();