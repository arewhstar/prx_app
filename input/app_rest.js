const express = require('express');
const app_rest = express();
const fs = require('fs');
const filename = "config.json";
const outputfilename = "config.json";
// LISTENERS LISTENERS LISTENERS LISTENERS LISTENERS
// GET LISTENERS
app_rest.get('/listeners',  (req, res) => {
   fs.readFile( __dirname + "/config/" + filename, (err, cfg_rawdata) => {
	var databack = JSON.parse(cfg_rawdata)["listeners"];
	
      console.log( JSON.stringify(databack) );
      res.end( JSON.stringify(databack) );
   });
})
//PUT LISTENER EXAMPLE
// curl -X PUT -H "Content-Type: application/json" http://127.0.0.1:8888/listeners -d  '{"name":"l3","address":"127.0.0.1","port":80,"filter_chains":0,"per_connection_buffer_limit_bytes":1,"metadata":2,"listener_filters":3,"socket_options":4}'

app_rest.put('/listeners',  (req, res) => {
   fs.readFile( __dirname + "/config/" + filename, (err, cfg_rawdata) => {
	var cfg_data = JSON.parse(cfg_rawdata);
	req.on('data',(req_rawdata) => {
		var req_data = JSON.parse(req_rawdata);
		var exist = 0;
		var empty = 1
		for(i in cfg_data.listeners){
			empty=0;

			if(i== req_data.name){
			
			exist=1;
			}
		}

		if(!exist){


			var existinglisteners = JSON.stringify(cfg_data.listeners);
			existinglisteners = existinglisteners.slice(0, existinglisteners.length-1);
			var newlistener =   JSON.stringify(req_data.name)+':' + req_rawdata+"}" ;
			if(!empty){
			
			newlistener = ","+newlistener;
			}
			else{
			
			}
			var newdata = cfg_data;
			newdata.listeners= JSON.parse(existinglisteners+newlistener);
			fs.writeFile(__dirname + "/config/" + outputfilename,JSON.stringify(newdata),(err) =>{});

			console.log(JSON.stringify(newdata));

		}
		// OPTIONAL RESPOnD
		//res.end(req_rawdata);
	});

   });
})
//POST LISTENERS
app_rest.post('/listeners',  (req, res) => {
   fs.readFile( __dirname + "/config/" + filename, (err, cfg_rawdata) => {
	var cfg_data = JSON.parse(cfg_rawdata);
	req.on('data',(req_rawdata) => {
		var req_data = JSON.parse(req_rawdata);
		var exist = 0;
		var counter = 1
		for(i in cfg_data.listeners){
			counter++;

			if(i== req_data.name){
			var newdata = cfg_data;
			newdata.listeners[i]= req_data;
			fs.writeFile(__dirname + "/config/" + outputfilename,JSON.stringify(newdata),(err) =>{});
			console.log(JSON.stringify(newdata));
			exist=1;
			}
		}

		if(!exist){
			console.log(req_data.name +" not found!");





		}
		// OPTIONAL RESPOnD
		//res.end(req_rawdata);
	});
   });
})
//DELETE LISTENERS
app_rest.delete('/listeners/:id',  (req, res) => {
   fs.readFile( __dirname + "/config/" + filename, (err, cfg_rawdata) => {
		var cfg_data = JSON.parse(cfg_rawdata);
		var newdata = cfg_data;
		delete newdata.listeners[req.params.id];
		for(i in cfg_data.routes){
			if(req.params.id== newdata.routes[i].listener){
				delete newdata.routes[i];
			}
		}
		fs.writeFile(__dirname + "/config/" + outputfilename,JSON.stringify(newdata),(err) =>{});
		// OPTIONAL RESPOnD
		// res.end(JSON.stringify(newdata));
   });
})
// GET CLUSTERS
app_rest.get('/clusters',  (req, res) => {
   fs.readFile( __dirname + "/config/" + filename, (err, cfg_rawdata) => {
	var databack = JSON.parse(cfg_rawdata)["clusters"];
	
      console.log( JSON.stringify(databack) );
      res.end( JSON.stringify(databack) );
   });
})
//PUT CLUSTERS EXAMPLE
// curl -X PUT -H "Content-Type: application/json" http://127.0.0.1:8888/clusters -d  '{"name":"cluster3","connect_timeout":10,"per_connection_buffer_limit_bytes":0,"lb_policy":"RR","hosts":0,"health_checks":0,"circuit_breakers":0,"socket_options":0,"metadata":0,"filters":0,"params":0}'

app_rest.put('/clusters',  (req, res) => {
   fs.readFile( __dirname + "/config/" + filename, (err, cfg_rawdata) => {
	var cfg_data = JSON.parse(cfg_rawdata);
	req.on('data',(req_rawdata) => {
		var req_data = JSON.parse(req_rawdata);
		var exist = 0;
		var empty = 1
		for(i in cfg_data.clusters){
			empty=0;

			if(i== req_data.name){
			
			exist=1;
			}
		}

		if(!exist){


			var existingclusters = JSON.stringify(cfg_data.clusters);
			existingclusters = existingclusters.slice(0, existingclusters.length-1);
			var newcluster =   JSON.stringify(req_data.name)+':' + req_rawdata+"}" ;
			if(!empty){
			
			newcluster = ","+newcluster;
			}
			else{
			
			}
			var newdata = cfg_data;
			newdata.clusters= JSON.parse(existingclusters+newcluster);
			fs.writeFile(__dirname + "/config/" + outputfilename,JSON.stringify(newdata),(err) =>{});

			console.log(JSON.stringify(newdata));

		}
		// OPTIONAL RESPOnD
		//res.end(req_rawdata);
	});

   });
})
//POST CLUSTERS
app_rest.post('/clusters',  (req, res) => {
   fs.readFile( __dirname + "/config/" + filename, (err, cfg_rawdata) => {
	var cfg_data = JSON.parse(cfg_rawdata);
	req.on('data',(req_rawdata) => {
		var req_data = JSON.parse(req_rawdata);
		var exist = 0;
		var counter = 1
		for(i in cfg_data.clusters){
			counter++;

			if(i== req_data.name){
			var newdata = cfg_data;
			newdata.clusters[i]= req_data;
			fs.writeFile(__dirname + "/config/" + outputfilename,JSON.stringify(newdata),(err) =>{});
			console.log(JSON.stringify(newdata));
			exist=1;
			}
		}

		if(!exist){
			console.log(req_data.name +" not found!");





		}
		// OPTIONAL RESPOnD
		//res.end(req_rawdata);
	});
   });
})
//DELETE CLUSTERS
app_rest.delete('/clusters/:id',  (req, res) => {
   fs.readFile( __dirname + "/config/" + filename, (err, cfg_rawdata) => {
		var cfg_data = JSON.parse(cfg_rawdata);
		var newdata = cfg_data;
		delete newdata.clusters[req.params.id];
		for(i in cfg_data.routes){
			if(req.params.id== newdata.routes[i].cluster){
				delete newdata.routes[i];
			}
			else{
				for(link in newdata.routes[i].transform.uplink){
					if(req.params.id== newdata.routes[i].transform.uplink[link]){
						newdata.routes[i].transform.uplink.splice(link,1);
					}

				}
				for(links in newdata.routes[i].transform.downlink){

					if(req.params.id== newdata.routes[i].transform.downlink[link]){
						delete newdata.routes[i].transform.downlink.splice(link,1);
					}
				}



			}
		}
		fs.writeFile(__dirname + "/config/" + outputfilename,JSON.stringify(newdata),(err) =>{});
		// OPTIONAL RESPOnD
		// res.end(JSON.stringify(newdata));

   });
})
// ROUTES ROUTES ROUTES ROUTES ROUTES ROUTES ROUTES
// GET ROUTES
app_rest.get('/routes',  (req, res) => {
   fs.readFile( __dirname + "/config/" + filename, (err, cfg_rawdata) => {
	var databack = JSON.parse(data)["routes"];
	
      console.log( JSON.stringify(databack) );
      res.end( JSON.stringify(databack) );
   });
})
//PUT ROUTE EXAMPLE
// curl -X PUT -H "Content-Type: application/json" http://127.0.0.1:8888/routes -d  '{"name":"r3","listener":"l1","cluster":"c1","transform":{"uplink":["c1","c2"],"downlink":[]}}'

app_rest.put('/routes',  (req, res) => {
   fs.readFile( __dirname + "/config/" + filename, (err, cfg_rawdata) => {
	var cfg_data = JSON.parse(cfg_rawdata);
	req.on('data',(req_rawdata) => {
		var req_data = JSON.parse(req_rawdata);
		var exist = 0;
		var empty = 1
		for(i in cfg_data.routes){
			empty=0;

			if(i== req_data.name){
			
			exist=1;
			}
		}

		if(!exist){


			var existingroutes = JSON.stringify(cfg_data.routes);
			existingroutes = existingroutes.slice(0, existingroutes.length-1);

			var newroute =   JSON.stringify(req_data.name)+':' + req_rawdata+"}" ;
			if(!empty){
			
			newroute = ","+newroute;
			}
			else{
			
			}
			var newdata = cfg_data;
			newdata.routes= JSON.parse(existingroutes+newroute);
			fs.writeFile(__dirname + "/config/" + outputfilename,JSON.stringify(newdata),(err) =>{});

			console.log(JSON.stringify(newdata));

		}
		// OPTIONAL RESPOnD
		//res.end(req_rawdata);
	});

   });
})
//POST ROUTE
// curl -X POST -H "Content-Type: application/json" http://127.0.0.1:8888/routes -d  '{"name":"r1","listener":"l1","cluster":"c1","transform":{"uplink":["c2"],"downlink":["c3"]}}'
app_rest.post('/routes',  (req, res) => {
   fs.readFile( __dirname + "/config/" + filename, (err, cfg_rawdata) => {
	var cfg_data = JSON.parse(cfg_rawdata);
	req.on('data',(req_rawdata) => {
		var req_data = JSON.parse(req_rawdata);
		var exist = 0;
		var counter = 1
		for(i in cfg_data.routes){
			counter++;

			if(i== req_data.name){
			var newdata = cfg_data;
			newdata.routes[i]= req_data;
			fs.writeFile(__dirname + "/config/" + outputfilename,JSON.stringify(newdata),(err) =>{});
			console.log(JSON.stringify(newdata));
			exist=1;
			}
		}

		if(!exist){
			console.log(req_data.name +" not found!");





		}
		// OPTIONAL RESPOnD
		//res.end(req_rawdata);
	});
   });
})
//DELETE ROUTE
app_rest.delete('/routes/:id',  (req, res) => {
   fs.readFile( __dirname + "/config/" + filename, (err, cfg_rawdata) => {
		var cfg_data = JSON.parse(cfg_rawdata);
		var newdata = cfg_data;
		delete newdata.routes[req.params.id];
		
		fs.writeFile(__dirname + "/config/" + outputfilename,JSON.stringify(newdata),(err) =>{});
		// OPTIONAL RESPOnD
		// res.end(JSON.stringify(newdata));
   });
})
module.exports = app_rest;
