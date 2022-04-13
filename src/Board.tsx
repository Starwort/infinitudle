import "./Board.css";
import {Row} from "./Row";

interface BoardProps {
    /** Up to 68 already-submitted guesses */
    guesses: string[];
    /** This board's word */
    secretWord: string;
    /** The current (partial) guess */
    currentGuess: string;
}

export function Board({guesses, secretWord, currentGuess}: BoardProps) {
    const blankRows = 68 - guesses.length;
    const rows = [...guesses.map((guess, index) => <Row key={index} guess={guess} answer={secretWord} submitted />),
    <Row key={guesses.length} guess={currentGuess} answer={secretWord} />,
    ...Array.from({length: blankRows}, (_, index) => <Row key={index + guesses.length} guess="" answer={secretWord} />)
    ];
    return <>
        <div className="board">
            <div>
                {rows.slice(0, 35)}
            </div>
            <div>
                {rows.slice(35)}
            </div>
        </div>
    </>;
}