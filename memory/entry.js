import Wordsearch from './';

document.addEventListener("DOMContentLoaded", function(event) { 
    const gameContainer = document.getElementById('game');
    Wordsearch.init(gameContainer,{});
});