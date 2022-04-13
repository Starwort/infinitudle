/** Function for sampling from an array
 *
 * Taken from https://stackoverflow.com/a/54160546
 */
export function sample<T>(array: T[], size: number): T[] {
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

/** Pick a random element of an array, avoiding a certain set of elements
 */
export function pick_random<T>(array: T[], avoid: T[] = []): T[] {
    while (true) {
        const index = Math.trunc(Math.random() * array.length);
        if (!avoid.includes(array[index])) {
            return [array[index]];
        }
    }
}

export enum LetterGrade {
    UNGRADED = 0,
    BLACK,
    YELLOW,
    GREEN,
}

type Five<T> = [T, T, T, T, T];

function zip<T, U>(a: T[], b: U[]): IterableIterator<[T, U]>;
function zip(a: string, b: string): IterableIterator<[string, string]>;
function* zip(a: any, b: any): any {
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
    const grades: Five<LetterGrade> = [LetterGrade.BLACK, LetterGrade.BLACK, LetterGrade.BLACK, LetterGrade.BLACK, LetterGrade.BLACK];
    const graded: Five<boolean> = [false, false, false, false, false];
    for (const [i, [guessed, real]] of enumerate(zip(guess, answer))) {
        if (guessed === real) {
            grades[i] = LetterGrade.GREEN;
            graded[i] = true;
        }
    }
    for (const [i, guessed] of enumerate(guess)) {
        const found = [...answer]
            .map<[string, number]>((v, j) => [v, j])
            .filter(([_, j]) => !graded[j])
            .find(([v, _]) => v === guessed);
        if (found) {
            const pos = found[1];
            grades[i] = LetterGrade.YELLOW;
            graded[pos] = true;
        }
    }
    return grades;
}
