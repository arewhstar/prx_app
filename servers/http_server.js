module.exports = 
function (address,port,routes,http_server){
		const transform = require('./transform/transform.js');

		http_server.on('connect', (req, cltSocket, head) => {
  			cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    		'Proxy-agent: Node.js-Proxy\r\n' +
                    		'\r\n');
			cltSocket.on('data',(data) =>{
				for(route in routes){
					transform.forward(routes[route].getConnections(),0,data,cltSocket,routes[route].getListener().getType(),0,routes[route].getNetwork());
				}


			});
			console.log('HTTP LISTENER: Connected');
  		});
		
		http_server.on('close', () => {
			console.log('HTTP LISTENER: Closed');
		});
		console.log(`HTTP LISTENER:${address}:${port}`);
		http_server.listen(port,address);


}












		
