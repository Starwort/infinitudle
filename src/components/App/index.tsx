import React from "react";
import {Board, IconButton, SettingsModal} from "..";
import {ALL_WORDS_SET} from "../../consts/allWords";
import {AnimationSpeed, FontSize, getNextWord, KeyboardLayout, sampleStarterWords} from "../../util";
import {Modal} from "../Modal";
import aboutIconBlack from "./about_icon_black.svg";
import aboutIconWhite from "./about_icon_white.svg";
import "./App.scss";
import settingsIconBlack from "./settings_icon_black.svg";
import settingsIconWhite from "./settings_icon_white.svg";

export function App() {
    const [words, setWords] = React.useState<string[]>([]);
    const [word, setWord] = React.useState("");
    const [secretWords, setSecretWords] = React.useState(sampleStarterWords());
    const [cleared, setCleared] = React.useState(0);
    const [theme, setTheme] = React.useState<"light" | "dark">("dark");
    const [isGameOver, setIsGameOver] = React.useState(false);
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [aboutOpen, setAboutOpen] = React.useState(false);
    const [fontSize, setFontSize] = React.useState(FontSize.MEDIUM);
    const [animationSpeed, setAnimationSpeed] = React.useState(AnimationSpeed.MEDIUM);
    const [
        keyboardLayout, setKeyboardLayout
    ] = React.useState<KeyboardLayout>("qwerty");

    const gameState = React.useRef({
        word,
        words,
        secretWords,
        foundSecretWords: new Map<string, number>(),
        guesses: 0,
        boards: new Map<string, number>(secretWords.map(secretWord => [secretWord, 0])),
    });
    gameState.current.word = word;
    gameState.current.words = words;
    gameState.current.secretWords = secretWords;

    React.useEffect(() => {
        if (!isGameOver) {
            const listener = (event: KeyboardEvent) => {
                if (document.body.classList.contains("modal-active")) {
                    console.log("Cancelled");
                    return;
                }
                const {word, words, secretWords, foundSecretWords, guesses} = gameState.current;
                if (event.key === "Enter" && word.length === 5 && ALL_WORDS_SET.has(word)) {
                    gameState.current.guesses++;
                    let found = secretWords.indexOf(word);
                    if (found !== -1) {
                        setCleared(cleared => cleared + 1);
                        const nextWord = getNextWord([...words, ...secretWords, ...foundSecretWords.keys()]);
                        foundSecretWords.set(word, guesses + 1);
                        gameState.current.boards.set(nextWord, guesses + 1);
                        setSecretWords([...secretWords, nextWord]);
                    }
                    setWords(words => [...words, word]);
                    setWord("");
                } else if (event.key === "Backspace") {
                    setWord(word => word.slice(0, -1));
                } else if (event.key.match(/^\w$/) && word.length < 5) {
                    setWord(word => word + event.key.toUpperCase());
                }
            };
            window.addEventListener("keydown", listener);
            return () => {
                window.removeEventListener("keydown", listener);
            };
        }
    }, [gameState, setSecretWords, setCleared, setWords, setWord, isGameOver]);

    const wordIsValid = word.length !== 5 || ALL_WORDS_SET.has(word);

    const endGame = React.useCallback(() => setIsGameOver(true), [setIsGameOver]);

    return <div className={`
        app
        app-${theme}
        app-keyboard-${keyboardLayout}
        app-font-${FontSize[fontSize].toLowerCase()}
        app-animation-${AnimationSpeed[animationSpeed].toLowerCase()}
    `}>
        <div className="app-header">
            <div className="app-header-content">
                <h1>Infinitudle</h1>
                <div className="padding" />
                <h2>Boards cleared: {cleared}</h2>
                <IconButton
                    onClick={() => setSettingsOpen(true)}
                    theme={theme}
                    iconWhite={settingsIconWhite}
                    iconBlack={settingsIconBlack}
                />
                <IconButton
                    onClick={() => setAboutOpen(true)}
                    theme={theme}
                    iconWhite={aboutIconWhite}
                    iconBlack={aboutIconBlack}
                />
            </div>
        </div>
        <div className={"boards" + (isGameOver ? " game-over" : "")}>
            {secretWords.map((secretWord) => {
                return <Board
                    key={secretWord}
                    secretWord={secretWord}
                    currentGuess={word}
                    guesses={words}
                    guessIsValid={wordIsValid}
                    complete={gameState.current.foundSecretWords.get(secretWord) ?? -1}
                    started={gameState.current.boards.get(secretWord)!}
                    onGameOver={endGame}
                />;
            })}
        </div>
        <SettingsModal
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            theme={theme}
            setTheme={setTheme}
            keyboardLayout={keyboardLayout}
            setKeyboardLayout={setKeyboardLayout}
            animationSpeed={animationSpeed}
            setAnimationSpeed={setAnimationSpeed}
            fontSize={fontSize}
            setFontSize={setFontSize}
        />
        <Modal
            open={aboutOpen}
            onClose={() => setAboutOpen(false)}
            theme={theme}
            title="About"
        >
            Infinitudle is a word game based on Wordle, except that
            Infinitudle has <em>infinitely many</em> words for you to guess;
            it is a game of endurance.
            <hr />
            Infinitudle by Starwort, <a href="https://github.com/Starwort/infinitudle">source code on GitHub</a>
            <hr />

            Based on:

            <ul>
                <li><a href="https://duotrigordle.com/">Duotrigordle</a> by Bryan Chen</li>
                <li><a href="https://hexadecordle.com/">Hexadecordle</a> by Alfie Rayner</li>
                <li><a href="https://octordle.com/">Octordle</a> by Kenneth Crawford</li>
                <li><a href="https://quordle.com/">Quordle</a> by @fireph</li>
                <li><a href="https://zaratustra.itch.io/dordle">Dordle</a> by Guilherme S. Töws</li>
                <li><a href="https://www.nytimes.com/games/wordle/index.html">Wordle</a> by Josh Wardle</li>
            </ul>
        </Modal>
    </div>;
}
