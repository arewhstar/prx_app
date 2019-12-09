module.exports=
function(address,port){
const http = require('http');
const app_rest = require('./app_rest');
const server_rest = http.createServer(app_rest);
server_rest.listen(port,address);
console.log("REST : "+address+":"+port);
}
