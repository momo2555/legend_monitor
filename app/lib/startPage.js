
class StartPage {
    constructor (legend) {
        this.legend = legend;
        legend.identification();

        legend.onStateChange((from, state) =>{
            console.log(legend.getState());
        });
        legend.onStateChange((from, state) =>{
            console.log("un nouvel etat de "+from+"!");
        });

        legend.setState("coucou");
        
        legend.onLaunch((from, game) => {
            legend.launchGame(game);
        });
        //start page change
        
    }
}
