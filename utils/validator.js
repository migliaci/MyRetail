//module responsible for validating payloads (for PUT requests) and product ID values (for GET and PUT requests)

exports.isValidPayload = function(payload)  {
    if(isNumeric(payload.value) && isValidCurrencyCode(payload.currency_code)) {
        return true;
    }
    return false;
};

exports.isValidParameter = function(parameter)  {
    if(isNumeric(parameter)) {
        return true;
    }
    return false;
};

//no currency codes other than USD are specified.
//myRetail product specs discussed an east-coast retailer.
//if we need to add additional currency validations, this can be done.
isValidCurrencyCode = function(code) {
    return (code != null && !isNumeric(code) && code.toUpperCase() === "USD");
};

isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};