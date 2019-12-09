module.exports = 
function (address,port,routes,udp_server){

		const transform = require('./transform/transform.js');


		udp_server.on('connect', (err) => {
  			console.log('UDP LISTENER: Connected');
		});
		udp_server.on('error', (err) => {
  			console.log(`UDP LISTENER: error:\n${err.stack}`);
  			udp_server.close();
		});
		udp_server.on('message', (msg, rinfo) => {
			for(route in routes){	
				transform.forward(routes[route].getConnections(),0,msg,rinfo,routes[route].getListener().getType(),udp_server,routes[route].getNetwork());	
			}
		});

		udp_server.on('listening', () => {
  			console.log(`UDP LISTENER: ${address}:${port}`);
			
		});
		udp_server.on('close', () => {
  			console.log('UDP LISTENER: Closed');
			
		});
		udp_server.bind(port,address);



}
