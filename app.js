require('dotenv').config();
var fs = require('fs');
var search = require('./search');
var chart = require('./chart');


module.exports.buildCharts = function buildCharts(ticker, callback) {
	search.getVantageChart(ticker , null, null, null, (err, res, change) => {
		if (err) {
			callback(err)
		} else {
			search.getStock(ticker, (err, stock) => {
				if (err) {
					callback("ERROR: " + err);
				} else {
					var companyName = stock.company.companyName.replace(/\(the\)/gi, "");
					chart.grapher(stock, res.year, {"dp": "close", "title" : companyName, "length" : "1 Year"}, (err, yearUrl) => {
						if (err) {
							callback("ERROR: " + err);
						} else {
							chart.grapher(stock, res.month, {"dp": "close", "title" : companyName, "length" : "3 Month"}, (err, monthUrl) => {
								console.log("")
								callback(null, yearUrl)
								callback(null, monthUrl)
								console.log("\n\n")
							});
						}
					});
				}
			});
		}
	});	  
}
