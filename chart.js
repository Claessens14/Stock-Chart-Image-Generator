require('dotenv').config();
var plotly = require('plotly')(process.env.PLOTLY_USERNAME, process.env.PLOTLY_PASSWORD);
var cloudinary = require('cloudinary');
var fs = require('fs');
const rn = require('random-number');

cloudinary.config({ 
  cloud_name: process.env.cloud_id, 
  api_key: process.env.cloudinary_api_key, 
  api_secret: process.env.cloudinary_app_secret
});

function grapher(stock, data, params, callback) {
  var xData = [];
  var yData = [];
  console.log(params)
  for (var day in data) {
    xData.push(day);
    yData.push(data[day][params["dp"]]);
  }

  var trace1 = {
    x: xData,
    y: yData,
    type: "scatter"
  };

  if (params.length) {
    params.title = params.title + " ("+ params.length + ")";
  }
  var figure = { 'data': [trace1], "layout" : {"title" : params.title}};

  var imgOpts = {
      format: 'png',
      width: 1000,
      height: 500,
      "layout": {
      "title": "Stock"
      }
  };

  //plot image
  plotly.getImage(figure, imgOpts, function (error, imageStream) {
    if (error) callback(error, null);
    if (!imageStream) callback("ERROR (plotly.getImage) imageStream is null, aborting", null);
    var options = {
      min:  1
    , max:  980
    , integer: true
    }
    var name = "./output/" + rn(options) + ".png";
    var fileStream = fs.createWriteStream(name)
      .on('finish', () => upload());
    imageStream.pipe(fileStream);

    //upload image
    function upload() {
      cloudinary.uploader.upload(name, function(result) { 
        if (result) {
          callback(null, result.url);
        } else {
          callback("ERROR (grapher) result is set to null from cloudinary", null);
        }
      });
    }
  });
}


module.exports = {
	grapher : grapher
}