import {Five, LetterGrade} from "../../util";
import "./Row.css";

interface RowProps {
    guess: string;
    grade?: Five<LetterGrade>;
    invalid?: boolean;
}

export function Row({guess, grade, invalid}: RowProps) {
    const grades = grade ?? [LetterGrade.UNGRADED, LetterGrade.UNGRADED, LetterGrade.UNGRADED, LetterGrade.UNGRADED, LetterGrade.UNGRADED];
    return <div className={"row" + (grade ? " graded" : "") + (invalid ? " invalid" : "")}>
        {Array.from({length: 5}, (_, index) => {
            return <div className={"cell " + LetterGrade[grades[index]].toLowerCase()}>
                {guess[index]}
            </div>;
        })}
    </div>;
}