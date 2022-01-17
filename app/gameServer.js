/**
 * websocket server
 */

const WebSocket = require('ws');

class GameServer {
    constructor (launcher) {
        this.wss = new WebSocket.Server({port: 2225});
        this.launcher= launcher;
        this.client = {
            "monitor": null,
            "controller": null
        }
    }
    run () {
        this.wss.on("connection", ws => {
            //connection begin
            
            console.log("New client connected");
            ws.on("message", data => {
                
                data = JSON.parse(data);
                console.log(data);
                if(data.header!==null && data.header.type!==null) {
                    if(data.header.type=="request") {
                        switch (data.request.exec) {
                            case "launchGame":
                                //a request to start the game is seended
                                let game = data.request.params.game;
                                this.startLauncher(ws, game);
                                break;
                            case "identification":
                                let id = data.header.from;
                                //save the connection
                                this.client[id] = ws;
                                break;
                            case "changeState":
                                let state = data.request.params.state;
                                this.newState(ws,data.header.from ,state);
                                break;
                            default:
                                break;
                        }
                        
                    }else if (data.header.type=="data_exchange") {
                        let to = data.header.to;
                        let from = data.header.from;
                        let data = data.data;
                        this.dataExchange(ws, to, from);

                    }
                }

            });
            ws.on("close", () => {
                console.log("Connection closed.");
            });
        });

        
    }
    /**
     * make a transfer between two pages
     * @param {*} client 
     * @param {*} from 
     * @param {*} to 
     * @param {*} data 
     */
    dataExchange(client, from, to, data) {
        let dataToSend = {
            header : {
                type : "data_exchange",
                from: from,
                to: to
            },
            data: data
        }
        //stringify
        strDataTosend = JSON.stringify(this.dataExchange);
        //send the data
        if(this.client[from]!=null) {
            this.client[from].send(strDataTosend);
        }
        
        
    }


    startLauncher(client, game) {
        //lanch a game only
        this.launcher.lanchGame(game.gameId);
        //then send to the monitor to charge the game
        if(this.client['monitor']!==undefined) {
            let req = {
                header: {
                    type: "request",
                    from: "server",
                    to: "monitor"
                },
                request: {
                    exec: "launchGame",
                    params : {
                        game: game   
                    }
                }
            }
            if(this.client['monitor']!=null && this.client['monitor']!==undefined){
                this.client['monitor'].send(JSON.stringify(req));
            }
        }

    }

    newState(client, from, state) {
        //send a new state of game
        let data =  {
            header : {
                type : "request",
                from: from
            },
            request : {
                exec : "changeState",
                params : {
                    state : state
                }
            }
            
        };
        
        this.sendAll(from, data);
    }

    sendAll(from, data) {
        let strData = JSON.stringify(data);
        
        for(const [key, client] of Object.entries(this.client)){
            if(client!=null && typeof client !== undefined) {
                client.send(strData);
            }
            
        }
        
    }

}
module.exports = GameServer;