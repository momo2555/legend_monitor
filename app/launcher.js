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
            url: '/lib/startPage.js',
            callback: (req, res) => {
                res.setHeader("Content-Type", "text/javascript");
                res.writeHead(200);
                fs.readFile('app/lib/startPage.js', (err, data)=>{
                    res.end(data);
                });
            }
        });
    }
    launchGame(game) {

    }
    /*getContentType(file) {
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
    }*/

}
module.exports = Launcher;