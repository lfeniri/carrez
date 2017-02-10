var cheerio = require('cheerio');
var JSON5 = require('json5');
var request = require('syncrequest');
var base_url = "https://www.meilleursagents.com/prix-immobilier/";

function getPath(info){ // info can be the CP or city or substring of city 

	var url_search = "https://api.meilleursagents.com/geo/v1/?types=regions,subregions,arrmuns,cities,subcities,boroughs,neighborhoods&q=";
	url_search += info;
	
	headers = {
		'User-Agent':       'Super Agent/0.0.1',
		'Content-Type':     'application/x-www-form-urlencoded'
	};

	options = {
		url: url_search,
		method: 'GET',
		headers: headers
	};

	var res = request.sync(options);
	var data = JSON.parse(res.response.body);
	if(data == undefined){
		data = new Object();
		data.error = "ERROR in LPEAD";
	}
	var path = base_url + data.response.places[0].slug + "/"; 
	return path; 
}

function getData(url){
	
	headers = {
		'User-Agent':       'Super Agent/0.0.1',
		'Content-Type':     'application/x-www-form-urlencoded'
	};

	options = {
		url: url,
		method: 'GET',
		headers: headers
	};

	var res = request.sync(options);
	var body = res.response.body;
	var $ = cheerio.load(body);
	var data = new Object();
	var i = 1;
	$(".medium-offset-0").each(function(i, elem) {
		if(i == 1){
			data.maison = new Object();
			data.maison.bas = parseFloat($(this).text().replace(",",".").replace(/\s/g,""));
			data.maison.moyen = parseFloat($(this).next().text().replace(",",".").replace(/\s/g,""));
			data.maison.haut = parseFloat($(this).next().next().text().replace(",",".").replace(/\s/g,""));
		}else if(i == 2){
			data.loyer = new Object();
			data.loyer.bas = parseFloat($(this).text().replace(",",".").replace(/\s/g,""));
			data.loyer.moyen = parseFloat($(this).next().text().replace(",",".").replace(/\s/g,""));
			data.loyer.haut = parseFloat($(this).next().next().text().replace(",",".").replace(/\s/g,""));
		}else{
			data.appartement = new Object();
			data.appartement.bas =parseFloat($(this).text().replace(/\s/g,""));
			data.appartement.moyen = parseFloat($(this).next().text().replace(",",".").replace(/\s/g,""));
			data.appartement.haut = parseFloat($(this).next().next().text().replace(",",".").replace(/\s/g,""));
			
		}
		i++;
	});
	return data;
}

exports.getData = getData;
exports.getPath = getPath;