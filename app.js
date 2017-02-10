var express = require('express');
var fs = require('fs');
var leboncoin = require("./leboncoin");
var meilleursagents = require("./meilleursagents");

var app = express();

function initHeader(res,type){
	res.setHeader('Content-Type', type);
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
}


app.use(express.static(__dirname + '/public'));

app.get('/getCity', function(req, res) {
    initHeader(res,'text/json');
    var r = leboncoin.getCity(req.query.zip,req.query.city);
	res.write(JSON.stringify(r));
	res.end();

});

app.get('/getBest', function(req, res) {

	initHeader(res,'text/json');
	var meilleur_agent = meilleursagents.getData(meilleursagents.getPath(req.query.city));
	agent_price = meilleur_agent[req.query.type].moyen;
	var ret = 1;
	if(req.query.type == "appartement")ret = 2;
	var e = leboncoin.getBestOffre(req.query.city,req.query.surface,ret,agent_price);
	res.write(JSON.stringify(e));
	res.end();
});
app.listen(3000);

app.get('/getData', function(req, res) {
	initHeader(res,'text/json');
	var dataRes = new Object();
	console.log("https://www.leboncoin.fr/ventes_immobilieres/"+req.query.url+".htm");
	if(req.query.url.includes("http")){
		dataRes.leboncoin = leboncoin.getData(req.query.url);
	}
	else
		dataRes.leboncoin = leboncoin.getData("https://www.leboncoin.fr/ventes_immobilieres/"+req.query.url+".htm");
	var path = meilleursagents.getPath(dataRes.leboncoin.cp);
	dataRes.meilleursAgents = meilleursagents.getData(path)[dataRes.leboncoin["type"]];
	dataRes.leboncoin.prixM2 = Math.round((parseFloat(dataRes.leboncoin.prix) / parseFloat(dataRes.leboncoin.surface))*100)/100;
		if(dataRes.leboncoin.prixM2 < dataRes.meilleursAgents.moyen-dataRes.meilleursAgents.moyen*10/100){
			dataRes.deal = 1;
		}else if(dataRes.leboncoin.prixM2 <= dataRes.meilleursAgents.moyen+dataRes.meilleursAgents.moyen*10/100){
			dataRes.deal = 0
		}else{
			dataRes.deal = -1;
		}


	res.write(JSON.stringify(dataRes));
	res.end();

});
