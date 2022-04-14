import React from 'react';
import './App.css';
import {Board} from './Board';
import {ALL_WORDS_SET} from './consts/allWords';
import {sampleStarterWords} from './util';

function App() {
    const [words, setWords] = React.useState<string[]>([]);
    const [word, setWord] = React.useState('');
    const [secretWords, setSecretWords] = React.useState(sampleStarterWords());
    const [showError, setShowError] = React.useState(false);
    const currentWord = React.useRef('');
    currentWord.current = word;

    React.useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            const word = currentWord.current;
            if (event.key === 'Enter') {
                if (word.length === 5) {
                    if (ALL_WORDS_SET.has(word)) {
                        setWords(words => [...words.slice(-67), word]);
                        setWord('');
                    } else {
                        setShowError(true);
                    }
                }
            } else if (event.key === 'Backspace') {
                setWord(word => word.slice(0, -1));
            } else if (event.key.length === 1 && word.length < 5) {
                setWord(word => word + event.key.toUpperCase());
            }
        };
        window.addEventListener('keyup', listener);
        return () => {
            window.removeEventListener('keyup', listener);
        };
    }, [currentWord]);

    console.log(words, secretWords);

    return (
        <div>
            {secretWords.map((secretWord, index) => {
                return <Board key={index} secretWord={secretWord} currentGuess={word} guesses={words} />;
            })}
        </div>
    );
}

export default App;
