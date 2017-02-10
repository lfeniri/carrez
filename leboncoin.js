var cheerio = require('cheerio');
var JSON5 = require('json5');
var request = require('syncrequest');

function getData(url){
var data;

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
	var $ = cheerio.load(res.response.body);
		
	$('script').each(function(i, elem) {
		var script = $(this).text(); 

		if(script.indexOf("var utag_data") !== -1){              
			var string = script.substring(script.indexOf("subcat_id"), script.indexOf("ges"));
			string = "{" + string + "}";
			data = JSON5.parse(string);
		}
		if(data == undefined){
			data = new Object();
			data.error = "error where load data";
			}
	});
	if(data == undefined){
		data = new Object();
		data.error = "error where load path";
	}
	return data;
}

/***** meilleurs offres *****/


function getCity(zip,city){
var data = [];
if(city == undefined) city = "";
if(zip == undefined) zip = "";
var url_geo = "https://www.leboncoin.fr/beta/ajax/location_list.html?zipcode="+zip+"&city="+city;
  headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
  };

  options = {
    url: url_geo,
    method: 'GET',
    headers: headers
  };

	var res = request.sync(options);
	var $ = cheerio.load(res.response.body);
		
	$('li').each(function(i, elem) {
		var e = $(this).text();
		data[i] = e.replace(/\t/g,'').replace(/\n/g,'');
	});
	return data;
}

function getBestOffre(city,surface,ret,agent_price){
agent_price = agent_price * parseFloat(surface);
var list_price = [0, 25000, 50000, 75000, 100000, 125000, 150000, 175000, 200000, 225000 , 250000, 275000 , 300000 , 325000 , 350000, 400000, 450000, 500000, 550000, 600000, 650000, 700000 , 800000, 900000, 1000000, 1100000, 1200000, 1300000, 1400000 , 1500000, 2000000, 2000000];
var list_area =  [0, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 200, 300, 500];
var ps,pe=0,sqs;

for(pe=0 ; pe < list_price.length ; pe++ ){
	if(agent_price < list_price[pe]){break;}
}
ps = pe - 1;
for(sqs=0 ; pe < list_area.length ; sqs++ ){
	if(surface < list_area[sqs]){break;}
}
sqs--;

var url_base = "https://www.leboncoin.fr/ventes_immobilieres/offres/ile_de_france/occasions/?location="+city+"&parrot=0&ps="+ps+"&pe="+pe+"&sqs="+sqs+"&ret="+ret;
var data = [];

  headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
  };

  options = {
    url: url_base,
    method: 'GET',
    headers: headers
  };

	var res = request.sync(options);
	var $ = cheerio.load(res.response.body);
		
	$('.list_item').each(function(i, elem) {
		var a = elem;
		data[i] = new Object();
		data[i].title = elem.attribs.title;
		data[i].href  = elem.attribs.href ;
		data[i].price = $(".item_price")[i].attribs.content; 	
		if(data == undefined){
			data = new Object();
			data.error = "error where load data";
			}
	});
	if(data == undefined){
		data = new Object();
		data.error = "error where load path";
	}
	return data;
}



exports.getData = getData;
exports.getCity = getCity;
exports.getBestOffre = getBestOffre;