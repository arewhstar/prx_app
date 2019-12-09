const Listener = require('./Listener.js');
const Cluster = require('./Cluster.js');
const Route = require('./Route.js');
const rest = require('./input/server_rest.js');
const fs = require('fs');
const EventEmitter = require('events');

//READ CONFIG##################################################

var restdata = fs.readFileSync('./input/config/config.json');
var readtime = new Date().getTime() - fs.statSync('./input/config/config.json').mtime ;
var restcfg = JSON.parse(restdata);

//REST application#########################################
rest(restcfg.admin["control-addr"].address,restcfg.admin["control-addr"].port);



//LOAD CONFIG###############################################################################
var listeners = [];
var clusters = [];
var routes = [];

for(l in restcfg.listeners){
	listeners.push(new Listener(restcfg.listeners[l]));
}
for(c in restcfg.clusters){
	//console.log(restcfg.clusters[c]);
	clusters.push(new Cluster(restcfg.clusters[c]));
}
for(r in restcfg.routes){
	//console.log(r);
	var route = new Route(restcfg.routes[r].name);
	for(l in listeners){
		if(restcfg.routes[r].listener==listeners[l].getName()){
			route.setListener(listeners[l]);
		}
	}
	var uplink = [];
	var downlink = [];
	for(c in clusters){
		if(restcfg.routes[r].cluster==clusters[c].getName()){
			route.setCluster(clusters[c]);
		}
		for(up in restcfg.routes[r].transform.uplink){
			if(restcfg.routes[r].transform.uplink[up]==clusters[c].getName()){
				uplink.push(clusters[c]);
			}
		}
		for(down in restcfg.routes[r].transform.downlink){
			if(restcfg.routes[r].transform.downlink[down]==clusters[c].getName()){
				downlink.push(clusters[c]);
			}
		}
	}
	route.addUplink(uplink);
	route.addDownlink(downlink);
	route.createConnections();
	route.buildNetwork();
	routes.push(route);

}
//#################################################################################

//INIT##########################################

	for(var l in listeners){
		var routelist =[];
		for(var route in routes){
			if(listeners[l].getName() == routes[route].getListener().getName()){
				
				routelist.push(routes[route]);
			}
		}
		listeners[l].createRoutelist(routelist);
		listeners[l].listen();
	}

//###############################################

//CHECK FOR UPDATE##################################################################
setInterval(()=>{
var checktime = new Date().getTime() - fs.statSync('./input/config/config.json').mtime;

if(checktime < readtime){
restdata = fs.readFileSync('./input/config/config.json');
restcfg = JSON.parse(restdata);


//LISTENER UPDATE
for(l in restcfg.listeners){
	var exist = false;
	for(var listener in listeners){
		if(listeners[listener].getName() == restcfg.listeners[l].name){
			exist = true;
			//UPDATE  ??RESTART = DELETE THEN CREATE NEW ONE
			if(listeners[listener].getPort() != restcfg.listeners[l].port || listeners[listener].getAddress() != restcfg.listeners[l].address || listeners[listener].getType() != restcfg.listeners[l].type){
				listeners[listener].deactivate();
			}
			listeners[listener].update(restcfg.listeners[l]);
		}
	
	}
	if(!exist){
		//ADD LISTENER
		listeners.push(new Listener(restcfg.listeners[l]));
	}
}
//LISTENER DELETE
for(var listener in listeners){
	var exist = false;
	for(l in restcfg.listeners){
		if(listeners[listener].getName() == restcfg.listeners[l].name){
			exist = true;
			
		}
	}
	if(!exist){
		//SHUT DOWN SERVER
		listeners[listener].deactivate();

		delete listeners[listener];
		listeners.splice(listener,1);

	}
}

//CLUSTER UPDATE
for(c in restcfg.clusters){
	var exist = false;
	for(cluster in clusters){
		if(clusters[cluster].getName() == restcfg.clusters[c].name){
			exist = true;
			clusters[cluster].update(restcfg.clusters[c]);
			
		}
	
	}
	if(!exist){
		//ADD CLUSTER
		clusters.push(new Cluster(restcfg.clusters[c]));
	}
}
//CLUSTER DELETE
for(var cluster in clusters){
	var exist = false;
	for(c in restcfg.clusters){
		if(clusters[cluster].getName() == restcfg.clusters[c].name){
			exist = true;
			
		}
	}
	if(!exist){
		
		delete clusters[cluster];
		clusters.splice(cluster,1);
	}
}
//ROUTE UPDATE
for(r in restcfg.routes){
	var exist = false;
	for(var route in routes){
		if(routes[route].getName() == restcfg.routes[r].name){
			exist = true;
			//UPDATE LISTENER
			if(routes[route].getListener().getName()!= restcfg.routes[r].listener){
				for(l in listeners){
					if(restcfg.routes[r].listener==listeners[l].getName()){
						routes[route].setListener(listeners[l]);
					}
				}
			}
			//UPDATE CLUSTER

			var uplink = [];
			var downlink = [];
			for(c in clusters){
				if(restcfg.routes[r].cluster==clusters[c].getName()){
					routes[route].setCluster(clusters[c]);
				}
				for(up in restcfg.routes[r].transform.uplink){
					if(restcfg.routes[r].transform.uplink[up]==clusters[c].getName()){
						uplink.push(clusters[c]);
					}
				}
				for(down in restcfg.routes[r].transform.downlink){
					if(restcfg.routes[r].transform.downlink[down]==clusters[c].getName()){
						downlink.push(clusters[c]);
					}
				}
			}
			routes[route].closeNetwork();
			routes[route].addUplink(uplink);
			routes[route].addDownlink(downlink);
			routes[route].createConnections();
			routes[route].buildNetwork();
		}
	
	}
	if(!exist){
		//ADD ROUTE
		var route = new Route(restcfg.routes[r].name);
		for(l in listeners){
			if(restcfg.routes[r].listener==listeners[l].getName()){
				route.setListener(listeners[l]);
			}
		}
		var uplink = [];
		var downlink = [];
		for(c in clusters){
			if(restcfg.routes[r].cluster==clusters[c].getName()){
				route.setCluster(clusters[c]);
			}
			for(up in restcfg.routes[r].transform.uplink){
				if(restcfg.routes[r].transform.uplink[up]==clusters[c].getName()){
					uplink.push(clusters[c]);
				}
			}
			for(down in restcfg.routes[r].transform.downlink){
				if(restcfg.routes[r].transform.downlink[down]==clusters[c].getName()){
					downlink.push(clusters[c]);
				}
			}
		}
	route.addUplink(uplink);
	route.addDownlink(downlink);
	route.createConnections();
	route.buildNetwork();
	routes.push(route);
		
	}
}
//Route DELETE
for(var route in routes){
	var exist = false;
	for(r in restcfg.routes){
		if(routes[route].getName() == restcfg.routes[r].name){
			exist = true;
			
		}
	}
	if(!exist){
		routes[route].destroyConnections();
		delete routes[route];
		routes.splice(route,1);
	}
}

//INIT#############################################

	for(var l in listeners){
		var routelist =[];
		for(var route in routes){
			if(listeners[l].getName() == routes[route].getListener().getName()){
				routelist.push(routes[route]);
			}
		}
		listeners[l].createRoutelist(routelist);
		listeners[l].listen();
	}




//################################################



readtime = checktime;
console.log("Config update happened!");
}
},1000);



