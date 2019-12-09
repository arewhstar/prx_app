module.exports = 
class Cluster {
	constructor(config){
		this.name=config.name;
		this.connect_timeout=config.connect_timeout;//ms
  		this.per_connection_buffer_limit_bytes=config.per_connection_buffer_limit_bytes;
  		this.lb_policy=config.lb_policy;
		this.hosts=[];//list

		for(var i in config.hosts){
			var converthost = config.hosts[i].split(":");
			//UDS
			if(converthost.length == 1){
			this.hosts.push({path:converthost[0]});
			}
			//NOT UDS
			else{
			this.hosts.push({address:converthost[0],port:parseInt(converthost[1],10)});
			}
		}
		
		this.health_checks=config.health_checks;
		this.circuit_breakers=config.circuit_breakers;
		this.socket_options=config.socket_options;
		this.metadata=config.metadata;
		this.filters=config.filters;//list
		this.params=config.params;
		this.type=config.type;
		this.lb_id=0;
	}
	update(config){
		this.name=config.name;
		this.connect_timeout=config.connect_timeout;//ms
  		this.per_connection_buffer_limit_bytes=config.per_connection_buffer_limit_bytes;
  		this.lb_policy=config.lb_policy;
		this.hosts.splice(0,this.hosts.length);//list

		for(var i in config.hosts){
			var converthost = config.hosts[i].split(":");
			//UDS
			if(converthost.length == 1){
			this.hosts.push({path:converthost[0]});
			}
			//NOT UDS
			else{
			this.hosts.push({address:converthost[0],port:parseInt(converthost[1],10)});
			}
		}
		
		this.health_checks=config.health_checks;
		this.circuit_breakers=config.circuit_breakers;
		this.socket_options=config.socket_options;
		this.metadata=config.metadata;
		//NEED EMPTY LIST FIRST
		this.filters=config.filters;//list
		this.params=config.params;
		this.type=config.type;
		this.lb_id=0;



	}

	runLoadBalance(){ 
		if(this.lb_policy=="RR"){

			if(this.lb_id == this.hosts.length){
				this.lb_id=0;
			}
			else{
				
				this.lb_id++;
			}

		}

		if(this.lb_policy=="FIRST"){
			this.lb_id=0;

		}
	


	}

	getHosts(){
		return this.hosts;
	}
	getName(){
		return this.name;
	}
	getEndpoint(){
		
		var id = this.lb_id;
		this.runLoadBalance();
		return this.hosts[id];
	

		
	}
	getType(){
		return this.type;
	}

}
