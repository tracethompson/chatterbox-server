var url = require("url");
var Data = function(){
  this.results = [];
}
var data = new Data();

exports.requestHandler = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  //----DEFAULT VALUES----
  var headers = defaultCorsHeaders;
  var statusCode = 200;
  var returnData = JSON.stringify({});
  var headerMessage = '';
  headers['Content-Type'] = "application/json";

  //URIs
  parsedURL = url.parse(request.url);
  splitURL = parsedURL.pathname.slice(1).split("/");

  
  var router = function(){
    if(splitURL[0] === 'classes'){ 
      if(request.method === 'OPTIONS'){
        optionsRequest();
      } else if (request.method === 'GET'){
        getRequest();
      } else if (request.method === 'POST'){
        postRequest();
      }
    } else {
      failedRequest();
    }
    //Call writeHead and response.end for every request
    response.writeHead(statusCode, headerMessage, headers);
    response.end(returnData);
  }

  var optionsRequest = function(){
    headers['access-control-allow-origin'] = request.headers.origin || '*';
    statusCode = 204;
    headerMessage = "Options request accepted";
  }

  var getRequest = function(){
    statusCode = 200;
    headerMessage = "GET request received";
    returnData = JSON.stringify(data);
  }

  var postRequest = function(){
    statusCode = 201;
    headerMessage = "POST received, thanks bro!";
    
    var body = '';  

    request.on('data', function(chunk){
      body += chunk;
    });

    request.on('end', function(){
      body = JSON.parse(body);
      body.roomname = getRoom();
      data.results.push(body);
    })
  }

  var failedRequest = function(){
    statusCode = 404;
    headerMessage = "File not found";
  }

  var getRoom = function(){
    if(splitURL === 'messages'){
      return 'lobby';
    } else {
      return splitURL[1];
    }
  }

  //Call router immediately on request
  router();
};

var defaultCorsHeaders = {
  "access-control-allow-origin": '*',
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

