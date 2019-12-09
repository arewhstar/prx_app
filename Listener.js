module.exports = 
class Listener {
	constructor(config){
		this.name=config.name;
		this.address=config.address;
		this.port=config.port;
		
		this.filter_chains= config.filter_chains;//list
		this.per_connection_buffer_limit_bytes=config.per_connection_buffer_limit_bytes;
		this.metadata=config.metadata;
		this.listener_filters=config.listener_filters;//list
		this.socket_options=config.socket_options;
		this.type=config.type;
		this.routes=[];
		this.state={active:false};           
		this.server;

	}
	update(config){
		this.name=config.name;
		this.address=config.address;
		this.port=config.port;
		this.filter_chains= config.filter_chains;//list
		this.per_connection_buffer_limit_bytes=config.per_connection_buffer_limit_bytes;
		this.metadata=config.metadata;
		this.listener_filters=config.listener_filters;//list
		this.socket_options=config.socket_options;
		this.type=config.type;
	}
	createRoutelist(newroutes){
		
		for(var route in this.routes){
			if(this.routes[route] == null){
				this.routes.splice(route,1);
			}
		}
		
		for(var newroute in newroutes){
			var addroute=true;
			for(route in this.routes){
				if(this.routes[route].getName() == newroutes[newroute].getName()){
					addroute=false;
				}
			}
			if(addroute){
				
				this.routes.push(newroutes[newroute]);
			}
		}
	}

	closeServer(){
		this.server.close();
	}
	activate(){
		this.state.active=true;
	}
	deactivate(){
		this.closeServer();
		this.state.active=false;
	}

	listen(){
		if(!this.state.active){
			this.state.active=true;
		switch(this.type){
			case "http":
				const http = require("http");
				const net = require('net');
				const url = require('url');

				this.server = http.createServer((req, res) => {
  					res.writeHead(200, { 'Content-Type': 'text/plain' });
  					res.end('okay');
				});
				const http_server = require('./servers/http_server.js');
				console.log("http");
				http_server(this.address,this.port,this.routes,this.server);
			break;
			case "udp":
				const dgram = require('dgram');
				this.server = dgram.createSocket('udp4');
				const udp_server = require('./servers/udp_server.js');
				udp_server(this.address,this.port,this.routes,this.server);
			break;
			case "ws" || "websocket":
				const WebSocket = require('ws');
				this.server = new WebSocket.Server({port:this.port});
				const ws_server = require('./servers/ws_server.js');
				ws_server(this.address,this.port,this.routes,this.server);
			break;

			default:
				console.log("ERROR:Server type incorrect in configuration.")
		}
		}

	}

	getName(){
		return this.name;
	}
	getPort(){
		return this.port;
	}
	getAddress(){
		return this.address;
	}
	getType(){
		return this.type;
	}
	


}

