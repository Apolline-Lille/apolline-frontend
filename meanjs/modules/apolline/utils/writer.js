var ResponsePayload = function(code, value) {
    this.code = code;
    this.value = value;
  }
  
  exports.respondWithCode = function(code, value) {
    return new ResponsePayload(code, value);
  }
  
  var writeCSV = exports.writeCSV = function(response, arg1, arg2) {
    var code;
    var value;
  
    if(arg1 && arg1 instanceof ResponsePayload) {
      writeCSV(response, arg1.value, arg1.code);
      return;
    }
  
    if(arg2 && Number.isInteger(arg2)) {
      code = arg2;
    }
    else {
      if(arg1 && Number.isInteger(arg1)) {
        code = arg1;
      }
    }
    if(code && arg1) {
      value = arg1;
    }
    else if(arg1) {
      value = arg1;
    }
  
    if(!code) {
      // if no response code given, we default to 200
      code = 200;
    }
    if(typeof payload === 'object') {
        const opts = {value};
        const parser = new Json2csvParser(opts);
        const csv = parser.parse(value);
        console.log(csv);
        //value = JSON.stringify(value, null, 2);
    }
    response.writeHead(code, {'Content-Type': 'application/json'});
    response.end(csv);
  }