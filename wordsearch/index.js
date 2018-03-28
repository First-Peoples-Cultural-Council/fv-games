/**
 * Scenes
 */
import Boot       from './js/boot';
import Preload    from './js/preload';
import GameTitle  from './js/gametitle';
import Main       from './js/main';
import GameOver   from './js/gameover';
import GameConfig from './js/config';


/**
 * Game manager creates game instance
 */
class WordSearch
{
    static game;

    constructor(containerElement, config)
    {
        GameConfig.setConfig(config);

        if(WordSearch.game)
        {
            WordSearch.game.destroy();
        }

        const game = new Phaser.Game(800, 900, Phaser.AUTO, containerElement);
        game.state.add("Boot", Boot);
        game.state.add("Preload", Preload);
        game.state.add("GameTitle", GameTitle);
        game.state.add("Main", Main);
        game.state.add("GameOver", GameOver);
        game.state.start("Boot");

        WordSearch.game = game;
    }

    destroy()
    {
        if(WordSearch.game)
        {
            WordSearch.game.destroy();
            WordSearch.game = null;
        }
    }
}

export default WordSearch;