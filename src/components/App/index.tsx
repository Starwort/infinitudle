import React from "react";
import {Board, IconButton, SettingsModal} from "..";
import {ALL_WORDS_SET} from "../../consts/allWords";
import {AnimationSpeed, FontSize, GameState, getNextWord, KeyboardLayout, loadGameOrGenerate, loadSettingsOrDefault, Theme, validateLocalStorage} from "../../util";
import {Modal} from "../Modal";
import aboutIconBlack from "./about_icon_black.svg";
import aboutIconWhite from "./about_icon_white.svg";
import "./App.scss";
import settingsIconBlack from "./settings_icon_black.svg";
import settingsIconWhite from "./settings_icon_white.svg";

export function App() {
    validateLocalStorage();
    const loadedGameState = loadGameOrGenerate();
    const loadedSettings = loadSettingsOrDefault();
    const [guessedWords, setGuessedWords] = React.useState(loadedGameState.guessedWords);
    const [currentWord, setCurrentWord] = React.useState("");
    const [secretWords, setSecretWords] = React.useState(loadedGameState.secretWords);
    const [theme, setTheme] = React.useState<Theme>(loadedSettings.theme);
    const [fontSize, setFontSize] = React.useState(loadedSettings.fontSize);
    const [animationSpeed, setAnimationSpeed] = React.useState(loadedSettings.animationSpeed);
    const [keyboardLayout, setKeyboardLayout] = React.useState(loadedSettings.keyboardLayout);
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [aboutOpen, setAboutOpen] = React.useState(false);
    const [gameOverModalOpen, setGameOverModalOpen] = React.useState(false);
    const [isGameOver, setIsGameOver] = React.useState(false);

    const gameState = React.useRef<GameState & {currentWord: string;}>({
        currentWord,
        ...loadedGameState,
    });
    gameState.current.currentWord = currentWord;
    gameState.current.guessedWords = guessedWords;
    gameState.current.secretWords = secretWords;

    React.useEffect(() => {
        if (!isGameOver) {
            const listener = (event: KeyboardEvent) => {
                if (document.body.classList.contains("modal-active")) {
                    console.log("Cancelled");
                    return;
                }
                const {currentWord, guessedWords, secretWords, foundSecretWords} = gameState.current;
                if (event.key === "Enter" && currentWord.length === 5 && ALL_WORDS_SET.has(currentWord)) {
                    let found = secretWords.indexOf(currentWord);
                    if (found !== -1) {
                        const nextWord = getNextWord([...guessedWords, ...secretWords, ...foundSecretWords.keys()]);
                        foundSecretWords.set(currentWord, guessedWords.length + 1);
                        gameState.current.boards.set(nextWord, guessedWords.length + 1);
                        setSecretWords([...secretWords, nextWord]);
                    }
                    setGuessedWords(words => [...words, currentWord]);
                    setCurrentWord("");
                } else if (event.key === "Backspace") {
                    setCurrentWord(word => word.slice(0, -1));
                } else if (event.key.match(/^\w$/) && currentWord.length < 5) {
                    setCurrentWord(word => word + event.key.toUpperCase());
                }
            };
            window.addEventListener("keydown", listener);
            return () => {
                window.removeEventListener("keydown", listener);
            };
        }
    }, [gameState, setSecretWords, setGuessedWords, setCurrentWord, isGameOver]);

    const wordIsValid = currentWord.length !== 5 || ALL_WORDS_SET.has(currentWord);

    const endGame = React.useCallback(() => setGameOverModalOpen(true), [setGameOverModalOpen]);

    const cleared = gameState.current.foundSecretWords.size;

    return <div className={`
        app
        app-${Theme[theme].toLowerCase()}
        app-keyboard-${KeyboardLayout[keyboardLayout].toLowerCase()}
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
                    currentGuess={currentWord}
                    guesses={guessedWords}
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
        <Modal
            open={gameOverModalOpen}
            onClose={() => {setGameOverModalOpen(false); setIsGameOver(true);}}
            theme={theme}
            title="Game Over"
        >
            {cleared > 100 && <>Well done!<br /></>}
            You were able to clear {cleared} boards!
            <hr />
            <button onClick={() => {
                navigator.clipboard.writeText(
                    `Infinitudle - ${cleared} boards cleared:\n\n` +
                    [...gameState.current.foundSecretWords.keys()].join("\n") +
                    "\n\n" + window.location.href
                );
            }}>Copy results</button>
        </Modal>
    </div>;
}
