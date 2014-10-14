/* Server socket API 
-------------------------------------------------- */
var fs = require('fs-extra')
,   database = require('../../api/database/database.local')
,   networkMethods = require('../../api/network/network.methods')
,   network
,   issuedToken;

/* Get issued Token (if available)
-------------------------------------------------- */
var issueToken = function(callback) {

      fs.readJson(__sessionFile, function(err, userProfile) {

            if (err) {
                console.log({error: err});
            }

            if (userProfile) {

                if (userProfile.token) {
                    var issuedToken = userProfile.token;
                    callback(null, issuedToken);
                }

                else {
                    callback("No token in session", null);
                }

            }
        
            else {
                callback({error: "No token supplied"});
            }
        
      })
};

/* Initialize Network Connection
-------------------------------------------------- */
var networkConnection = function(token, ansp, callback) {

    var io = require('socket.io-client');


    // Connect to /network, pass credidentials.
    nsp = io.connect('http://162.243.206.41:6052/network', {
        'query': 'token=' + token
    });


    // Successfully Connected and Auth'd
    nsp.on('connect', function (socket, sock) {

        network = nsp;

        if (callback) {
            callback(null, network);
        }

    }).on('disconnect', function () {

        console.log('disconnected from /network');

    });

    nsp.on('network', function(data, sock) {

        if (data.run) {
            networkMethods[data['cmd']](nsp, data);
        }

        else {
            __api.emit('network-api', data);
        }

    })

    // Could not connect or could not authenticate
    nsp.on("error", function(error) {

      // ||Client Box||: Your server token is invalid
      console.log(error)

      if (callback) {
          callback(error, null);
      }

    });

}

/* Network Interfacing
-------------------------------------------------- */
var networkInterface = function(ansp, json) {

    if (!issuedToken) {
        issueToken(function(err, token) {
            if (!err) {
                issuedToken = token;
                json.token = token;
                networkCommand(ansp, json);
            }

            else {
                return;
            }
        });
    }

    else {
        json.token = issuedToken;
        networkCommand(ansp, json);
    }

}

var networkCommand = function(ansp, json) {

    if (!json.token) {
        console.log("[!] No Token Supplied");
    }
    
    if (!network) {

            console.log("Attempting Connect to send command: " + json.cmd);

            networkConnection(issuedToken, ansp, function(err, network) {
                    
                if (err) {
                   // ||Client Box||: You are not connected to the server interface
                    console.log("[!] Network Authentication Error: "+err);
                }

                else {
                    network.emit('cmd', json);
                }

            });

        }

        // Send Network Commands
        else {
            console.log("sending command: "+json)
            network.emit('cmd', json);
        }
}


exports.networkConnection   = networkConnection;
exports.networkInterface    = networkInterface;
exports.networkCommand      = networkCommand;