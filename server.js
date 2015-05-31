var express = require('express');
var bodyParser = require('body-parser');
var	products = require('./routes/products');
var responseBuilder = require('./utils/response');
 
var app = express();

// parse application/json 
app.use(bodyParser.json())

app.use('/products/', function(req, res, next) {
	if(req.method != "GET") {
  		var contype = req.headers['content-type'];
  	if (!contype || contype.indexOf('application/json') !== 0)
    	return res.status(400).send(responseBuilder.buildErrorResponse('Bad request: Content-Type header must be application/json.'));
	}
	
  next();
});

 
app.get('/products', products.findAll);
app.get('/products/:id', products.findById);
app.put('/products/:id', products.updateProduct)
 
app.listen(3000);
console.log('Listening on port 3000...');