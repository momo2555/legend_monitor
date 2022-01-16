var udp = require('dgram');
var ip = require("ip");

/**
 * UDP server
 */
class DetectionServer {
    constructor(){
        this.server;
    }
    run() {
        this.server = udp.createSocket('udp4');
        this.server.on('message',(msg,info) => {
            console.log('Data received from client : ' + msg.toString());
            //console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
            
            let message = {
                "server" : true,
                "name" : "nodeJs monitor server",
                "ip"  : ip.address() 
            }
            let strMsg = JSON.stringify(message)
            //sending msg
            this.server.send(strMsg,2223,info.address,(error) => {
              if(error){
                client.close();
              }else{
                console.log('Udp data sent !!!');
              }
        
            });
        
        });
        this.server.on('listening',()=>{
            var address = this.server.address();
            var port = address.port;
            var family = address.family;
            var ipaddr = address.address;
            //console.log('TServer is listening at port' + port);
            //console.log('Server ip :' + ipaddr);
            //console.log('Server is IP4/IP6 : ' + family);
          });
          
          //emits after the socket is closed using socket.close();
          this.server.on('close',()=>{
            console.log('Detection Socket is closed !');
          });

          this.server.bind(2222);

    }
}
module.exports = DetectionServer;