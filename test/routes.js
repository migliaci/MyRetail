var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var uriBuilder = require('../utils/uri')
var baseUrl = 'http://localhost:3000';

//integration tests
//requires application to be up and running

describe('GET product name from external service', function() {

it('responds with 200, service is available', function(done){
  var id = "16752456";

  var uri = uriBuilder.getUriToExternalService(id);
  var base = uriBuilder.getApiUriPrefix();

  request(base)
      .get(uri.substring((base.length - 1), uri.length))
      .expect(200, done)
  });

});

describe('GET product route', function() {

it('responds with 400, invalid product id format', function(done){
	request(baseUrl)
      .get("/products/abcdefghi")
      .expect(400, done)
  });

it('responds with 404, product id not in database', function(done){
    request(baseUrl)
      .get("/products/12345") //anyone's luggage code?
      .expect(404, done)
  });


//retrieve contents of local database
it('responds with 200, valid products in database (only searches locally; does not call external service)', function(done){
    request(baseUrl)
      .get("/products") 
      .expect(200, done)
  });

//NOTE: Alternatively, we could also potentially remove dependency on external API by mocking the call with nock and turn these into unit tests that don't call to external service.
it('responds with 200, product id exists (includes call to external service)', function(done){
    request(baseUrl)
      .get("/products/16696652") 
      .expect(200, done)
  });

it('responds with 200, product id exists (includes call to external service)', function(done){
    request(baseUrl)
      .get("/products/13860428") 
      .expect(200, done)
  });

it('responds with 200, product id exists (includes call to external service)', function(done){
    request(baseUrl)
      .get("/products/15117729") 
      .expect(200, done)
  });

it('responds with 200, product id exists (includes call to external service)', function(done){
    request(baseUrl)
      .get("/products/16752456") 
      .expect(200, done)
  });

});

describe('PUT product route', function() {

it('responds with 400, invalid product id format', function(done){

	var priceUpdate = {value:12345, currency_code:"USD"};

    request(baseUrl)
      .put("/products/abcdefghi")
      .set("Content-Type", "application/json")
      .send(priceUpdate)
      .expect(400, done)
    
  });

it('responds with 400, invalid price format in payload', function(done){

	var priceUpdate = {value:"HERP!", currency_code:"USD"};

    request(baseUrl)
      .put("/products/16696652")
      .set("Content-Type", "application/json")
      .send(priceUpdate)
      .expect(400, done)
    
  });

it('responds with 400, invalid currency code in payload', function(done){

	var priceUpdate = {value:42.42, currency_code:"DERP!"};

    request(baseUrl)
      .put("/products/16696652")
      .set("Content-Type", "application/json")
      .send(priceUpdate)
      .expect(400, done)
    
  });

it('responds with 400, product id not in database', function(done){

	var priceUpdate = {value:42.42, currency_code:"USD"};

    request(baseUrl)
      .put("/products/12345")
      .set("Content-Type", "application/json")
      .send(priceUpdate)
      .expect(404, done)
    
  });

it('responds with 200, valid payload, product id exists in database', function(done){

	var priceUpdate = {value:42.42, currency_code:"USD"};

    request(baseUrl)
      .put("/products/16696652")
      .set("Content-Type", "application/json")
      .send(priceUpdate)
      .expect(200, done)
    
  });

});

