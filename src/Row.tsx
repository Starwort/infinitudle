import './Row.css';
import {grade, LetterGrade} from './util';

interface RowProps {
    guess: string;
    submitted?: boolean;
    answer: string;
}

export function Row({guess, answer, submitted}: RowProps) {
    const grades = submitted ? grade(guess, answer) : [LetterGrade.UNGRADED, LetterGrade.UNGRADED, LetterGrade.UNGRADED, LetterGrade.UNGRADED, LetterGrade.UNGRADED];
    return <div className={"row" + (submitted ? ' graded' : '')}>
        {Array.from({length: 5}, (_, index) => {
            return <div className={"cell " + LetterGrade[grades[index]].toLowerCase()}>
                {guess[index]}
            </div>;
        })}
    </div>;
}