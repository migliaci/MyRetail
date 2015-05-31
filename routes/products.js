var mongo = require('mongodb');
var validator = require('../utils/validator');
var responseBuilder = require('../utils/response');
var uriBuilder = require('../utils/uri');
var request = require('request');

var Server = mongo.Server;
var	Db = mongo.Db;


var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('product_db', server);

//This will open the database and create the test data for the proof-of-concept API if it doesn't already exist.
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'product_db' database");
        db.collection('products', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'products' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

//NOTE: for an actual API, we would use pagination or some other method to limit results returned from a GET endpoint like this.
//As this is a proof-of-concept, it is used for testing the contents of our local database.
exports.findAll = function(req, res) {
    db.collection('products', function(err, collection) {
    collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });

};
 
 //processes request to locate pricing information in local database, if successful then external API is called to retrieve name information.
 //if name information does not exist (in the case of a couple of sample product id values provided), a 404 is returned. 
exports.findById = function(req, res) {
    var idParam = req.params.id;

    db.collection('products', function(err, collection) {

        if(!validator.isValidParameter(idParam)) {
            //send back a 400 if id value is not numeric.
            res.status(400).send(responseBuilder.buildErrorResponse('Bad request: product id was malformed.'));        
        } else {

    	var intParam = parseInt(idParam); 
        collection.findOne({'product_identifier':intParam}, function(err, item) {

            if(item == null) {
            //send back a 404 if no item could be located in the database.
              res.status(404).json(responseBuilder.buildErrorResponse('Not found: pricing information for supplied product id could not be found in datastore.'));    
            
            } else {

                //perform lookup for product name
                var uri = uriBuilder.getUriToExternalService(intParam); 
                request(uri, function (error, response, body) {
        
                if (!error && response.statusCode == 200) {
                    //parse response from external API to find product name information
                    var jsonFromRemoteServer = JSON.parse(body);
                    var compositeResponse = jsonFromRemoteServer.product_composite_response; 

                    if(compositeResponse != null) {

                        if(compositeResponse.items != null) {

                            //iterate over array to locate a match for online description, which contains name field
                            var responseReturned = false;
                            for(var i = 0; i < compositeResponse.items.length; i++) {
                                if(compositeResponse.items[i].online_description != null) {
                                var itemName = compositeResponse.items[i].online_description.value;
                                var pricingInfo = item;
                                responseReturned = true;
                                res.send(responseBuilder.buildGetResponse(intParam, itemName, pricingInfo.current_price));
                                } else {
                                    if((i === compositeResponse.items.length - 1) && !responseReturned) {
                                        //lookup failed - online_description not found in response.
                                        res.status(404).send(responseBuilder.buildErrorResponse('Not found: online_description value could not be found in response returned from external API.')); 
                                    }
                                }
                            }

                        } else {
                            //lookup failed - no items in composite response.
                            res.status(404).send(responseBuilder.buildErrorResponse('Not found: name value could not be found in response returned from external API.')); 
                        }

                    } else {
                        //lookup failed - no composite response object.
                        res.status(404).send(responseBuilder.buildErrorResponse('Not found: name value could not be found in response returned from external API.')); 
                    }
                    
                } else {
                    //error was returned from external API itself
                    res.status(parseInt(response.statusCode)).send(responseBuilder.buildErrorResponse('Error: external API could not retrieve name value.'));
            }
        });

            }

        });
    }
    });

};

//processes request to update pricing information for an existing item.
//if item doesn't exist in database, a 404 is returned.
exports.updateProduct = function(req, res) {
    var idParam = req.params.id;
    var body = req.body;

    //validate input
    if(!validator.isValidParameter(idParam)) {
            //send back a 400 if id value is not numeric.
            res.status(400).send(responseBuilder.buildErrorResponse('Bad request: product id was malformed.'));        
    } else if (!validator.isValidPayload(body)) {
            //send back a 400 if request body contains invalid format
            res.status(400).send(responseBuilder.buildErrorResponse('Bad request: request payload was malformed.'));      
    } else {

    var intParam = parseInt(idParam);

   db.collection('products', function(err, collection) {
       collection.findAndModify({'product_identifier':intParam},[],{$set:{current_price:body}}, {}, function(err, object) {
        if (err){
          res.status(400).send(responseBuilder.buildErrorResponse(err.message));       
        } else{
            if(object.value == null) {
                //findAndModify doesn't return an error if item could not be found.
                //we have to account for this case explicitly.
                res.status(404).send(responseBuilder.buildErrorResponse('Not found: product id could not be found in datastore.'));  
            } else {
                res.status(200).send(responseBuilder.buildUpdateResponse(intParam));
            }
        }

      });

    });
    
    }

};

populateDB = function() {
 
    var products = [
    {
        product_identifier: 13860428,
        //name: "The Big Lebowski (Blu-ray) (Widescreen)",
        current_price: {"value":13.49, "currency_code":"USD"}
    },
    
    {
        product_identifier: 15117729,
        //name: "Apple&reg; iPad Air 2 16GB Wi-Fi - Gold",
        current_price: {"value":449.00, "currency_code":"USD"}
    },
    {
        product_identifier: 16483589,
        //name: "iPhone 6 Plus 128GB Gold - AT&T with 2-year contract",
        current_price: {"value":379.99, "currency_code":"USD"}
    },
    {
        product_identifier: 16696652,
        //name: "Beats Solo 2 Wireless - Black (MHNG2AM&#47;A)",
        current_price: {"value":299.99, "currency_code":"USD"}
    },
    {
        product_identifier: 16752456,
        //name: "Lego&reg; Super Heroes The Tumbler 76023",
        current_price: {"value":199.99, "currency_code":"USD"}
    },
    {
        product_identifier: 15643793,
        //name: unknown
        current_price: {"value":4.99, "currency_code":"USD"}
    }
    ];
 
    db.collection('products', function(err, collection) {
        collection.insert(products, {safe:true}, function(err, result) {});
    });
 
};
