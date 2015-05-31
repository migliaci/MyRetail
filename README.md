
MyRetail
==============

Welcome to this sample node.js API for retrieving product data across two different sources!

This is actually my first time dipping my toes into the wonderful world of Node.js.

PREREQUISITES:
--------------
- Node.js installation
- MongoDB installation

GETTING STARTED:
--------------

After downloading and unpacking your project, set up your dependencies and run the project using the following commands (note that Mongo will also need to be running in order to create the stubbed data):

    > mongod
    > npm install
    > node server.js

This will start the server on localhost:3000 and generate some stub pricing data in a mongo database called product_db. You should now be able to retrieve pricing and naming data on a set of products.

RUNNING TESTS:
--------------

An integration test suite written using mocha is provided to validate the API endpoints included in this project.  This can be run from the root directory of the project with the "mocha" command. In order for tests to pass, API server and Mongo must be running.  In addition, a test is included to validate whether external API service being accessed by the project is available.
    
    > mocha

DETAILS:
--------------

Stubbed product ids included in this version:

-13860428
-15117729
-16483589
-16696652
-16752456
-15643793

GET PRODUCT INFORMATION:
--------------

To retrieve product information, hit the following API URI:

    /products/{id}

Where {id} is one of the product ids listed above.  Information will be returned to the caller as JSON. 

EXAMPLE:

    GET http://localhost:3000/products/16752456

RESPONSE:

    {
        "id": 16752456,
        "name": "Lego&reg; Super Heroes The Tumbler 76023",
        "current_price": {
            "value": 122.42,
            "currency_code": "USD"
        }
    }

Value listed for {id} must be numeric.  Improperly formatted {id} values will return an error as JSON. A similar error will also be returned for cases when a numeric {id} value cannot be found in the database.

EXAMPLE:

    GET http://localhost:3000/products/foo

RESPONSE:

    {
        "error_message": "Bad request: product id was malformed."
    }


PUT PRICING INFORMATION:
--------------

To update product pricing information, hit the following API URI:

    /products/{id}

Where {id} is one of the product ids listed above.  Information will be returned to the caller as JSON.

Please note that this endpoint only accepts Content-Type: application/json. 

EXAMPLE:

    PUT http://localhost:3000/products/16752456

PAYLOAD:

    {
        "value":42.42,
        "currency_code":"USD"
    }

RESPONSE:

    {
        "id": 16752456,
        "status": "update successful"
    }

Both "value" and "currency_code" are required values, and must be formatted as follows:

"value": must be non-null and numeric.
"currency_code": must be specified as "USD".  Currently other currency_code values are not supported but can be easily added via the validator module.

Specifying an invalid payload will return the following response:

PAYLOAD:

    {
        "value":"FOOBAR!",
        "currency_code":"NOPE!"
    }

RESPONSE:

    {
        "error_message": "Bad request: request payload was malformed."
    }