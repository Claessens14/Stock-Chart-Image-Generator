
var app = require('./app');

var ticker = "AMZN";
console.log("\nRequesting charts for \'" + ticker + "\'\n - Charting via Plotly\n - Hosting via Cloudinary\n\n")
app.buildCharts(ticker, (err, res) => {
    if (err) {
        console.log(err)
    } else {
        
        console.log(res);
    }
})

