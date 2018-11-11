/**
 * primary file
 * 
 * 
 */

//dependencies
var config = require('./config');
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');

/**
 * https server create
 */
var httpServer = http.createServer(function (req, res) {
    unifiedServer(req, res)
});

/**
 * http server listening
 */
httpServer.listen(config.httpPort, function () {
    console.log("listening on port " + config.httpPort);
});


/**
 * https server options
 */
var httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
}

/**
 * https server create
 */
var httpsServer = https.createServer(httpsServerOptions, function (req, res) {
    unifiedServer(req, res)
});

/**
 * https server listening
 */
httpsServer.listen(config.httpsPort, function () {
    console.log("listening on port " + config.httpsPort);
});

/**
 * Handles both http & https requests
 * @param {*} req 
 * @param {*} res 
 */
var unifiedServer = function (req, res) {
    //get url and parse it
    var parsedUrl = url.parse(req.url, true);

    //get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //Get the query string as an object
    var queryStringObject = parsedUrl.query;

    //Get http method
    var method = req.method.toLowerCase();

    //Get headers
    var headers = req.headers;

    //Get payload
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    req.on('data', function (data) {
        buffer += decoder.write(data);
    });


    req.on('end', function () {

        //chosen handler/router
        var chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        //data
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        }

        //call the handler
        chosenHandler(data, function (statusCode, payload) {
            //check statuscode is correct
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            //check payload is object
            payload = typeof (payload) == 'object' ? payload : {};

            //stringfy the object
            var payloadString = JSON.stringify(payload);

            //write statusCode to head
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log('request payload sent : ', payloadString);

        });

    });

}

/**
 * request handlers
 */
var handlers = {};

/**
 * server online/offilne endpoint
 * @param {*} data 
 * @param {*} callback 
 */
handlers.ping = function (data, callback) {
    callback(200);
}

/**
 * Hello world endpoing
 * @param {*} data 
 * @param {*} callback 
 */
handlers.hello = function (data, callback) {

    var returnData = {};
    returnData.message = "Hi welcome to Node.js master class at Pirple";

    callback(200, returnData);
}

/**
 * url not found
 * @param {*} data 
 * @param {*} callback 
 */
handlers.notFound = function (data, callback) {
    callback(404);
}

/**
 * routes
 */
var router = {
    'ping': handlers.ping,
    'hello': handlers.hello
};