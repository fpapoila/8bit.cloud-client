/* Network.isOnline
-------------------------------------------------- */
var fs 		= require('fs-extra')
,   _ 		= require('lodash')
,	os 		= require('os')
,	request = require('request');


/* Connected to the Internet
-------------------------------------------------- */
function sysGetNetwork(nsp) {
	// var ifaces = os.networkInterfaces();


	// for (var dev in ifaces) {
	//   var alias=0;
	//   ifaces[dev].forEach(function(details){
	//     if (details.family=='IPv4') {
	//       console.log(dev+(alias?':'+alias:''),details.address);
	//       ++alias;
	//     }
	//   });
	// }

	// http://ipinfo.io/json

	// request.get({
 //        uri: "http://ipinfo.io/json"
 //    }, function (error, response, body) {
 //    		if (error) {
 //    			nsp.emit('api', {error: error});
 //    		}

 //    		else {
	//            console.log(body);
	//            nsp.emit('api', {networkInfo: body}); 
 //       		}
 //    });

}


function sysIsOnline(nsp) {

	require('dns').resolve('www.google.com', function(err) {
	  if (err) {
	  	nsp.emit('api', {internetConnected: "disconnected"});
	  	return true;
	  }
	  else {
	  	nsp.emit('api', {internetConnected: "connected"});  
	  	return false;
	  }
	});

}

/* Connected to the Ignition Server
-------------------------------------------------- */
function isOnline(nsp, username, hash) {

    nsp.emit('api', {isOnline: true, username: "Alex Stubbs"});       
           
}

/* Exports
-------------------------------------------------- */

exports.sysIsOnline 	= sysIsOnline;
exports.isOnline 		= isOnline;
exports.sysGetNetwork 	= sysGetNetwork;
