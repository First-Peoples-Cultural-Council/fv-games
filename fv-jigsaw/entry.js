//Styles
import './style.css';

//Scenes
import Boot from './js/boot';
import Preload from './js/preload';
import GameTitle from './js/gametitle';
import Main from './js/main';
import GameOver from './js/gameover';


(()=>{
    const game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');
    //Add all states
    game.state.add("Boot", Boot);
    game.state.add("Preload", Preload);
    game.state.add("GameTitle", GameTitle);
    game.state.add("Main", Main);
    game.state.add("GameOver", GameOver);

    //Start the first state
    game.state.start("Boot");
})()