
var WEATHER_MODULE = (function () {

	var weather_module = {},
		service = 'api.openweathermap.org/data/2.5/weather',
		request,
		query_string,
		sqlite3,
		db,
		config,
		url,
		content,

		init = function () {
			request = require('request');
			query_string = require('querystring');
			sqlite3 = require('sqlite3').verbose();
			db = new sqlite3.Database('db.db');
			config = require('./config.json');

			url = (function (url, params) {
				qs = query_string.stringify(params);
				return 'http://' + url.replace('http://', '') + '?' + qs;
			}(service, config));

			if (process.argv[2] == 'reset') {
				db.run('DROP table weather_data');
			}

			db.run('CREATE TABLE if not exists weather_data (data TEXT)');
		},

		insertData = function () {
			init();

			request(url, function (err, res, body) {
				if (err && res.statusCode != 200) {
					return console.log([err, res]);
				}

				content = body;

				db.serialize(function() {
					var stmt = db.prepare('INSERT INTO weather_data VALUES (?)');

					stmt.run(content);
					stmt.finalize();
				});

				db.close();
			});
		},

		getData = function () {
			db.each('SELECT rowid AS id, data FROM weather_data', function(err, row) {
				console.log(row.id + ": " + row.data);
			});
		};

	weather_module.getData = getData;

	return weather_module;

}());

WEATHER_MODULE.getData();
