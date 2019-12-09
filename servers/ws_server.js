module.exports = 
function (address,port,routes,wss){
		
		const transform = require('./transform/transform.js');

		const ws_address = wss.address();
		console.log(`WS LISTENER: ${ws_address.port}`);
		wss.on('connection', function (ws) {
			console.log("WS LISTENER: Connected');
  			ws.on('message', (message) => {
    				
				for(route in routes){
					transform.forward(routes[route].getConnections(),0,message,ws,routes[route].getListener().getType(),0,routes[route].getNetwork());	
				}
  			});

  			ws.on('close', () => {
    				console.log('WS connection closed');
  			});
  			ws.on('error', () => {
    				console.log('Error');
  			});
		});
		wss.on('close', () => {
			console.log('WS LISTENER: Closed');
		});

}



