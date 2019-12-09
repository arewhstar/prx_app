module.exports = 

class Route {

	constructor(name){
		this.name=name;
		this.listener;
  		this.cluster;
  		this.uplink=[];
		this.downlink= [];//list
		this.connections=[];
		this.network=[];
		

	}

	setListener(listener){
		this.listener=listener;
	}
	setCluster(cluster){
		this.cluster=cluster;
	}
	addUplink(uplinklist){
		this.uplink.splice(0,this.uplink.length);
		for(up in uplinklist){
			this.uplink.push(uplinklist[up]);
		}
		
	}
	addDownlink(downlinklist){
		this.downlink.splice(0,this.downlink.length);
		for(down in downlinklist){
			this.downlink.push(downlinklist[down]);
		}
		
	}

	getListener(){
		return this.listener;
	}
	getCluster(){
		return this.cluster;
	}
	getUplink(){
		return this.uplink;
	}	
	getDownlink(){
		return this.downlink;
	}
	getName(){
		return this.name;
	}
	createConnections(){//
		this.connections.splice(0,this.connections.length);
		for(var up_i in this.uplink){
		//UPLINK

			this.connections.push(this.uplink[up_i]);
				
		}
		//Cluster

		this.connections.push(this.cluster);

		for(var down_i in this.downlink){
		//DOWNLINK

			this.connections.push(this.downlink[down_i]);

		}
	
	}
	getConnections(){//
		return this.connections;

	}


	buildNetwork(){//
		const WebSocket = require('ws');
		const dgram = require('dgram');
		const http = require('http');
		this.network.splice(0,this.network.length);
		for(var i in this.connections){
			switch(this.connections[i].getType()){
				case "http": 		
						var endpoint = this.connections[i].getEndpoint();
						const options = {
							port:endpoint.port,
							host:endpoint.address,
							method:'CONNECT'
						};
						const request = http.request(options);
						request.end();
						request.on('connect', (res, socket, head) => {this.network.push(socket);});				
				break;
				case "udp":		
						const udpconn = dgram.createSocket('udp4');
						var endpoint = this.connections[i].getEndpoint();
						udpconn.connect(endpoint.port,endpoint.address,() => {});
						this.network.push(udpconn);
				break;
				case "ws"||"websocket": 
						var endpoint = this.connections[i].getEndpoint();
						const wsconnection = new WebSocket('ws://'+endpoint.address+':'+endpoint.port);
						this.network.push(wsconnection);
				break;
				case "uds": 
						var endpoint = this.connections[i].getEndpoint();
						const udsconnection = new WebSocket('ws+unix:///'+endpoint.path);

						this.network.push(udsconnection);
				break;
				default:
				break;

			}
		}

	}

	closeNetwork(){//

		for(var i in this.connections){
			switch(this.connections[i].getType()){
				case "http": 		
					this.network[i].destroy();
				break;
				case "udp":		
					this.network[i].disconnect();
					this.network[i].close();
				break;
				case "ws"||"websocket"||"uds": 
					this.network[i].close();
				break;
				default:
				break;

					}
		}

	}

	getNetwork(){
		return this.network;

	}



}
