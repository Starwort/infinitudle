import React from 'react';
import './App.css';
import {Board} from './Board';
import {STARTER_WORDS} from './consts/starterWords';
import {sample} from './util';

function App() {
    const [words, setWords] = React.useState<string[]>([]);
    const [word, setWord] = React.useState('');
    const [secretWords, setSecretWords] = React.useState(sample(STARTER_WORDS, 64));

    return (
        <div onKeyDown={(event) => {
            if (event.key === 'Enter') {
                if (word.length === 5) {
                    setWords([...words.slice(-67), word]);
                    setWord('');
                }
            } else if (event.key === 'Backspace') {
                setWord(word.slice(0, -1));
            } else if (event.key.length === 1) {
                setWord(word + event.key);
            }
        }}>
            {secretWords.map((secretWord, index) => {
                return <Board key={index} secretWord={secretWord} currentGuess={word} guesses={words} />;
            })}
        </div>
    );
}

export default App;
