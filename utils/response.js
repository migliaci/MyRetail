//module responsible for generating JSON to be returned in responses.

exports.buildGetResponse = function(id, name, price) {
    return JSON.parse('{"id":'+ id +', "name":'+ "\"" + String(name) + "\"" + ', "current_price": {' + '"value":' + price.value + ', "currency_code":' + "\"" + String(price.currency_code) +"\"" + "}}");
};

exports.buildUpdateResponse = function(id, name, price) {
    return JSON.parse('{"id":'+ id +', "status":'+ "\"" + "update successful"+ "\"" + "}");
};

exports.buildErrorResponse = function(message) {
    return JSON.parse('{"error_message":'+ "\"" + String(message) + "\"" + "}");
};