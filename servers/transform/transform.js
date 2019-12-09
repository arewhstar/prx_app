module.exports = {
forward: function f(clusters,counter,msg,endpoint,ltype,udpsrv,connections){
const WebSocket = require('ws');
const dgram = require('dgram');
const http = require('http');

switch (clusters[counter].getType()){
	case "http":
			connections[counter].write(msg);
			connections[counter].on('data',(data)=>{
				if(clusters.length-1 > counter){
					f(clusters,counter+1,data,endpoint,ltype,udpsrv,connections);
					counter=clusters.length;
					return;
				}
				if(clusters.length-1 == counter){
					switch(ltype){
						case "http": 		endpoint.write(data);
						break;
						case "udp":		udpsrv.send(data,endpoint.port,endpoint.address);
						break;
						case "ws"||"websocket": endpoint.send(data);
						break;
						default:
						break;


					}
					counter=clusters.length;
					return;
				}
			}).setMaxListeners(0);
			connections[counter].on('end',()=>{
			
			});

	break;
	case "udp":

		
			connections[counter].send(msg);
			connections[counter].on('message',(data)=> {
				if(clusters.length-1 > counter){
					f(clusters,counter+1,data,endpoint,ltype,udpsrv,connections);
						counter=clusters.length;
						return;
				}
				if(clusters.length-1 == counter){
					switch(ltype){
						case "http": 		endpoint.write(data);
						break;
						case "udp":		udpsrv.send(data,endpoint.port,endpoint.address);
						break;
						case "ws"||"websocket": endpoint.send(data);
						break;
						default:
						break;
					

					}	
					counter=clusters.length;
					return;
				}
				
				
			}).setMaxListeners(0);
			connections[counter].on('close',()=>{

			});
 
	break;
	case "ws" || "websocket" || "uds":

  			connections[counter].send(msg);
			connections[counter].on('message', (data)=> {
  				if(clusters.length-1 > counter){
					f(clusters,counter+1,data,endpoint,ltype,udpsrv,connections);
					counter=clusters.length;
					return;
				}
				if(clusters.length-1 == counter){
	
					switch(ltype){
						case "http": 		endpoint.write(data);
						break;
						case "udp":		udpsrv.send(data,endpoint.port,endpoint.address);
						break;
						case "ws"||"websocket": endpoint.send(data);
						break;
						default:
						break;
					}
					counter=clusters.length;
					return;
				}
		
			}).setMaxListeners(0);
			connections[counter].on('close',() =>{
				
			});
	break;

	default:
			console.log("ERROR:Bad cluster type in configuration.")
	break;
}
}
}
