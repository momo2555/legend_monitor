class MonitorGame {
    constructor (legend) {
        this.legend = legend;
        this.stage = 0;
        this.word = "";
        this.brokenWord = "";
        this.usedLetters = [];

    }
    initGame() {
        this.legend.setState({
            stage : 0,
            word: "",
            brokenWord : "",
            usedLetters : [],

        });
    }
    initEvents() {

    }
    saveState() {
        
    }
}