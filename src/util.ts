import {ALL_WORDS} from "./consts/allWords";
import {STARTER_WORDS} from "./consts/starterWords";

/** Function for sampling from an array
 *
 * Taken from https://stackoverflow.com/a/54160546
 */
function sample<T>(array: T[], size: number): T[] {
    const results: T[] = [];
    const sampled: Record<number, boolean> = {};
    while (results.length < size && results.length < array.length) {
        const index = Math.trunc(Math.random() * array.length);
        if (!sampled[index]) {
            results.push(array[index]);
            sampled[index] = true;
        }
    }
    return results;
}

export function sampleStarterWords(): string[] {
    return sample(STARTER_WORDS, 64);
}

/** Pick a random element of an array, avoiding a certain set of elements
 */
function pickRandom<T>(array: T[], avoid: T[] = []): T {
    while (true) {
        const index = Math.trunc(Math.random() * array.length);
        if (!avoid.includes(array[index])) {
            return array[index];
        }
    }
}

export function getNextWord(guesses: string[]): string {
    return pickRandom(ALL_WORDS, guesses);
}

export enum LetterGrade {
    UNGRADED = 0,
    BLACK,
    YELLOW,
    GREEN,
}

export type Five<T> = [T, T, T, T, T];

export function* zip<T, U>(a: ArrayLike<T>, b: ArrayLike<U>): IterableIterator<[T, U]> {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        yield [a[i], b[i]];
    }
}

function enumerate<T>(iter: IterableIterator<T>): IterableIterator<[number, T]>;
function enumerate(iter: string): IterableIterator<[number, string]>;
function* enumerate(iter: any): any {
    let i = 0;
    for (const item of iter) {
        yield [i++, item];
    }
}

/** Grade word guess */
export function grade(guess: string, answer: string): Five<LetterGrade> {
    const grades: Five<LetterGrade> = [
        LetterGrade.BLACK,
        LetterGrade.BLACK,
        LetterGrade.BLACK,
        LetterGrade.BLACK,
        LetterGrade.BLACK,
    ];
    const graded: Five<boolean> = [false, false, false, false, false];

    for (const [i, [guessed, real]] of enumerate(zip(guess, answer))) {
        if (guessed === real) {
            grades[i] = LetterGrade.GREEN;
            graded[i] = true;
        }
    }

    for (const [i, [guessed, real]] of enumerate(zip(guess, answer))) {
        if (guessed !== real) {
            const found = [...answer]
                .map<[string, number]>((v, j) => [v, j])
                .find(([v, j]) => (
                    !graded[j] &&
                    v === guessed
                ));
            if (found) {
                const pos = found[1];
                grades[i] = LetterGrade.YELLOW;
                graded[pos] = true;
            }
        }
    }
    return grades;
}

export type KeyboardLayout = "qwerty" | "dvorak" | "colemak";

export enum FontSize {
    SMALL,
    MEDIUM,
    LARGE,
    EXTRA_LARGE,
}

export enum AnimationSpeed {
    NONE,
    SLOW,
    MEDIUM,
    FAST,
}
