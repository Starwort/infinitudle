import {Row} from "..";
import {grade, LetterGrade, zip} from "../../util";
import "./Board.scss";

interface BoardProps {
    /** All guesses */
    guesses: string[];
    /** This board's word */
    secretWord: string;
    /** The current (partial) guess */
    currentGuess: string;
    /** Whether the current guess is valid */
    guessIsValid: boolean;
    /** When this board started */
    started: number;
    /** When this board was completed, or -1 if this board has not been completed */
    complete: number;
    /** Callback that ends the game */
    onGameOver: () => void;
}

export function Board({guesses, secretWord, currentGuess, guessIsValid, complete, started, onGameOver}: BoardProps) {
    const isComplete = complete !== -1;
    const guessesEnd = isComplete ? complete : guesses.length;
    if (isComplete) {
        currentGuess = "";
    }
    const nGuesses = guessesEnd - started;
    if (nGuesses === 69) {
        onGameOver();
    }
    const warn = nGuesses >= 68;
    const grades = guesses.map(guess => grade(guess, secretWord));
    const rows = [
        ...guesses.slice(started, guessesEnd).map((guess, index) => <Row key={index} guess={guess} grade={grades[index + started]} />),
        <Row key={nGuesses} guess={currentGuess} invalid={!guessIsValid} />,
    ];
    for (let i = nGuesses + 1; i < 69; i++) {
        rows.push(<Row key={i} guess="" />);
    }
    const letters = new Map([
        ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    ].map<[string, LetterGrade]>((i) => [i, LetterGrade.UNGRADED]));
    for (let i = started; i < guessesEnd; i++) {
        for (let [letter, grade] of zip(guesses[i], grades[i])) {
            if (
                grade === LetterGrade.GREEN
                || (
                    grade === LetterGrade.YELLOW
                    && letters.get(letter) !== LetterGrade.GREEN
                ) || (
                    grade === LetterGrade.BLACK
                    && letters.get(letter) === LetterGrade.UNGRADED
                )
            ) {
                letters.set(letter, grade);
            }
        }
    }

    return <>
        <div className={"board" + (warn ? " danger" : "") + (isComplete ? " complete" : "")}>
            <div>
                {rows.slice(0, 35)}
            </div>
            <div>
                {rows.slice(35, 69)}
            </div>
            <div className="keyboard">
                {[...letters.entries()].map(([letter, grade]) => <div className={`cell keyboard-${letter.toLowerCase()} ` + (grade ? LetterGrade[grade].toLowerCase() : "")} key={letter}>{letter}</div>)}
            </div>
        </div>
    </>;
}