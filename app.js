var express = require('express');
var path = require('path');
var app = express();
var config = require("./config.json");
var axios = require("axios");

axios.defaults.baseURL = "https://api.clashofclans.com/v1";
axios.defaults.headers.common['Authorization'] = "Bearer " + config.coc_token;
axios.defaults.headers.common['Accept'] = 'application/json';

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", config.allowed_origins);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', function(req, res){
	var query = req.query;
	console.info("query: ", query);
	var data = {};
	var status = 200;
	if(!query.token || query.token !== config.compute_access_token || !query.url){
		status = 404;
		data = {
			message: "This page does not exists.",
			error: {}
		}
		sendResponse(res, data, status);
		return;
	}
	var params = {};
	Object.keys(query).forEach(key => {
		if(key === "token" || key === "url"){
			return;
		}
		params[key] = query[key];
	});
	var uri = query.url.replace(/#/g, "%23");
	console.info("uri: ", uri);
	axios.get(uri, params).then(payload => {
		sendResponse(res, payload, status);
	}).catch(err => {
		status = 404;
		data = err.response.data;
		sendResponse(res, data, status);
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		sendResponse(res, {
			message: err.message,
			error: err
		}, err.status || 500);
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	sendResponse(res, {
		message: err.message,
		error: {}
	}, err.status || 500);
});

var sendResponse = function(res, data, status){
	res.type("application/json");
	res.status(status || 200);
	res.send(data || {});
};

module.exports = app;
