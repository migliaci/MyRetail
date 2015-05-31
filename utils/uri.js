//module responsible for computing URI to external service
//NOTE: may need to handle additional keys for different consumers based on myRetail requirements / security concerns.
//if requirements change, we can pass the key in as a header value.
var apiKey = "43cJWpLjH8Z8oR18KdrZDBKAgLLQKJjz"; 
var apiUriPrefix = "https://api.target.com/products/v3/";
var apiUriSuffix = "?fields=descriptions&id_type=TCIN&key=";

exports.getUriToExternalService = function(productId)  {
    return apiUriPrefix + String(productId) + apiUriSuffix + apiKey;
};

exports.getApiUriPrefix = function(productId)  {
    return apiUriPrefix;
};