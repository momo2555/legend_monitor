const Launcher = require('./app/launcher');
const GameServer = require('./app/gameServer');
const DetectionServer = require('./app/detectionServer');

//creating first the game launcher
var launcher = new Launcher();
//creating the gameServer
var gameServer = new GameServer(launcher);
//creating the detection server
var detectionServer = new DetectionServer();
//run the detection server
detectionServer.run();
//run the launcher
launcher.run();
//run the game server
gameServer.run();
//launching the start page on the monitor
launcher.startMonitor();
//launch a test game
setTimeout(() => {
    console.log('launching game');
    gameServer.startLauncher(null, {
        gameId : 'pendu',
        monitor : 'monitor.html'
    });
}, 10000);

