var express = require("express");
const request = require('request');
const fs = require('fs'), 
	path = require('path'), 
	bodyParser = require('body-parser');
	certFile =  path.resolve('apple_pay_certificate.p12')
var app = express();
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-XSRF-Token,X-FC-XSRF-TOKEN,X-FC-KUBE-CANARY');
    next();
}
app.use(allowCrossDomain);
app.use(bodyParser.json());
app.listen(process.env.PORT ||9981, () => {
 console.log("Server running on port 9981");
});

app.get("/status",(req,res,next) => {
	var repsonse  = { "success": true }
	res.contentType('application/json');
    res.send(repsonse, 200);

});
app.get("/.well-known/apple-developer-merchantid-domain-association.txt", function (req, res, next) {
	var file = './.well-known/apple-developer-merchantid-domain-association.txt';
    res.download(file);   
});

app.get("/getMerchantToken", (req, res, next) => {
	const request = require('request');
	console.log(fs.readFileSync(certFile));
	const options = {
	    url: 'https://apple-pay-gateway.apple.com/paymentservices/paymentSession',
		pfx: fs.readFileSync(certFile),
	    passphrase: '',
	    json : {
			"merchantIdentifier": "merchant.abc.pay.freshchat",
            "displayName": "Freshchat Apple Pay",
            "initiative": "messaging",
            "initiativeContext": "https://apple-pay-mm.herokuapp.com/paymentGateway"	    
        }
	};	
	request.post(options, 
		(http_err, http_res, http_body) => {
			  if (http_err) { 
			  	res.send(http_err)

			  }
			  res.json(http_body)
	});	
});

app.post('/paymentGateway', function(req, res){
	var rBody = req.body
	console.log("<==========================>")
	console.log("<=== Payment Gateway Request Body :: Request Identifier ===>")
	console.log("<==========================>")
	console.log(rBody.requestIdentifier)
    res.contentType('application/json');
    var repsonse  = { "status": "STATUS_SUCCESS" }
	res.contentType('application/json');
    res.send(repsonse, 200);
});

app.post('/orderTracking', function(req, res){
	var rBody = req.body
	console.log("<==========================>")
	console.log("<=== Order Tracking Body :: Request Identifier ===>")
	console.log("<==========================>")
	console.log(rBody.requestIdentifier)
    res.contentType('application/json');
    var repsonse  = { "status": "STATUS_SUCCESS" }
	res.contentType('application/json');
    res.send(repsonse, 200);
});
 