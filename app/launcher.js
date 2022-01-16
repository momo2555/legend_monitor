const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const glob = require("glob");
const { url } = require('inspector');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('./app/image'));

class Launcher {
    constructor () {
        this.server;
        this.routes = []; //{url, callback}
        
    }
    run () {
        //start the http server
        app.get('*', (req, res) => {
            //the server is started !!! ;)
            for(const route of this.routes ) {
                //send the right page (depending of the url)
                if(req.url == route.url) {
                    route.callback(req, res);
                }
            }

        });
        app.listen(2226);
        /*this.server.listen(8082, 'localhost', () => {
            console.log('serever is running !');
        });*/
    }
    startMonitor()  {
        //show the monitor start page
        this.routes.push({
            url : '/startpage',
            callback: (req, res) => {
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                fs.readFile('app/startPage.html', (err, data)=>{
                    res.end(data);
                });
            }
        });
        this.routes.push({
            url: '/startpage/style.css',
            callback: (req, res) => {
                res.setHeader("Content-Type", "text/css");
                res.writeHead(200);
                fs.readFile('app/startpage/style.css', (err, data)=>{
                    res.end(data);
                });
            }
        });
        this.routes.push({
            url: '/lib/legend.js',
            callback: (req, res) => {
                res.setHeader("Content-Type", "text/javascript");
                res.writeHead(200);
                fs.readFile('app/lib/legend.js', (err, data)=>{
                    res.end(data);
                });
            }
        });
        this.routes.push({
            url: '/lib/startPage.js',
            callback: (req, res) => {
                res.setHeader("Content-Type", "text/javascript");
                res.writeHead(200);
                fs.readFile('app/lib/startPage.js', (err, data)=>{
                    res.end(data);
                });
            }
        });
        this.routes.push({
            url: '/lib/jquery.js',
            callback: (req, res) => {
                res.setHeader("Content-Type", "text/javascript");
                res.writeHead(200);
                fs.readFile('app/lib/jquery.js', (err, data)=>{
                    res.end(data);
                });
            }
        });
    }


    lanchGame(gameId) {
        //reading the game.json file
        let data = fs.readFileSync('app/games/'+gameId+'/game.json', {encoding: 'utf8'});
        //parse json
        let parsedata = JSON.parse(data);
        //fetch in the games folder for all files
        let gameFolder = 'app/games/'+gameId;
        //add files in the htto route
        glob(gameFolder + "/**", (err, files) => {
            for(const file of files){
                if(fs.existsSync(file)){
                    
                    var url = file.replace(gameFolder, '');
                    
                    if(! this.routeExists(url) ) {
                        this.routes.push({
                            url: url,
                            callback: (req, res) => {
                                res.setHeader("Content-Type",this.getContentType(file));
                                res.writeHead(200);
                                fs.readFile(file, (err, data)=>{
                                    res.end(data);
                                });
                            }
                        });
                    }
                    
                }
            }
        });
        //the game is launched
       
        
    }
    getContentType(file) {
        let contentType = "";
                let ext = "";
                let fileSplit = file.split('.');
                let lastInedx = fileSplit.length - 1;
                if(fileSplit[lastInedx]!=null) {
                    ext = fileSplit[lastInedx];
                    switch(ext) {
                        case 'html':
                            contentType = "text/html";
                            break
                        case 'css':
                            contentType = "text/css";
                            break;
                        case 'css':
                            contentType = "text/javascript";
                            break;
                        case 'png', 'jpeg', 'bmp', 'gif', 'webp', 'jpg':
                            contentType = "image/" + ext;
                            break;
                        case 'mp3', 'midi', 'mpeg', 'webm', 'ogg', 'wav':
                            contentType = "audio/"+ext;
                            break;
                        case 'pdf', 'xml':
                            contentType = "application/"+ext;
                    }
                    return contentType;
                }
    }
    routeExists(routeUrl) {
        let exist = false;
        for(let route in this.routes) {
            if(route.url == routeUrl) exist = true;
        }
        return exist;
    }

}
module.exports = Launcher;