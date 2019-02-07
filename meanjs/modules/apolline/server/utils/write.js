

var ResponsePayload = function(code, value) {
  this.code = code;
  this.value = value;
}

exports.respondWithCode = function(code, value) {
  return new ResponsePayload(code, value);
}

var writeCSV = exports.writeCSV = async function(response, arg1, arg2) {
  var code;
  var value;
  //console.log("writeCSV stringify: " + JSON.stringify(response));
  console.log("writeCSV arg1: " + arg1);
  console.log("writeCSV arg2: " + arg2);
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
  if(typeof value === 'object') {
    var data = JSON.stringify(value);
    console.log('data = '+data);
  }
  else{
    var data = value.toString();
  }
  response.writeHead(code, {'Content-Type': 'application/txt'});
  response.end(data);
}

/*var query = url.parse(req.url, true).query;
     
    if (typeof query.file === 'undefined') {
        //specify Content will be an attachment
        res.setHeader('Content-disposition', 'attachment; filename=theDocument.txt');
        res.setHeader('Content-type', 'text/plain');
        res.end("Hello, here is a file for you!");
    } else {
        //read the image using fs and send the image content back in the response
        fs.readFile('/path/to/a/file/directory/' + query.file, function (err, content) {
            if (err) {
                res.writeHead(400, {'Content-type':'text/html'})
                console.log(err);
                res.end("No such file");    
            } else {
                //specify Content will be an attachment
                res.setHeader('Content-disposition', 'attachment; filename='+query.file);
                res.end(content);
            }
        });
    }*/