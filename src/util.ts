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

export enum KeyboardLayout {
    QWERTY,
    DVORAK,
    COLEMAK,
}

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

export enum Theme {
    LIGHT,
    DARK,
}

export function members(enum_: Object): string[] {
    return Object.values(enum_).filter(k => typeof k === "string");
}

export interface Settings {
    keyboardLayout: KeyboardLayout;
    fontSize: FontSize;
    animationSpeed: AnimationSpeed;
    theme: Theme;
}

export function loadSettingsOrDefault(): Settings {
    const settings = localStorage.settings;
    try {
        return JSON.parse(settings!);
    } catch {
        return {
            keyboardLayout: KeyboardLayout.QWERTY,
            fontSize: FontSize.MEDIUM,
            animationSpeed: AnimationSpeed.MEDIUM,
            theme: Theme.DARK,
        };
    }
}
export interface GameState {
    guessedWords: string[];
    secretWords: string[];
    foundSecretWords: Map<string, number>;
    boards: Map<string, number>;
}

export function loadGameOrGenerate(): GameState {
    const game = localStorage.game;
    try {
        return JSON.parse(game!);
    } catch {
        const secretWords = sampleStarterWords();
        return {
            guessedWords: [],
            secretWords,
            foundSecretWords: new Map(),
            boards: new Map(secretWords.map(secretWord => [secretWord, 0])),
        };
    }
}

export function validateLocalStorage(): void {
    const settings = loadSettingsOrDefault();
    if (!(settings.keyboardLayout in KeyboardLayout)) {
        settings.keyboardLayout = KeyboardLayout.QWERTY;
    }
    if (!(settings.fontSize in FontSize)) {
        settings.fontSize = FontSize.MEDIUM;
    }
    if (!(settings.animationSpeed in AnimationSpeed)) {
        settings.animationSpeed = AnimationSpeed.MEDIUM;
    }
    if (!(settings.theme in Theme)) {
        settings.theme = Theme.DARK;
    }
    localStorage.settings = JSON.stringify(settings);
    const gameState = loadGameOrGenerate();
    if (
        !gameState.guessedWords
        || !gameState.secretWords
        || !gameState.foundSecretWords
        || gameState.secretWords.length - gameState.foundSecretWords.size !== 64
        || !gameState.boards
        || gameState.boards.size !== gameState.secretWords.length
    ) {
        localStorage.removeItem("game");
    }
}

export function toTitleCase(s: string): string {
    return s.replace("_", " ").replace(/([A-Z])([A-Z]*)/g, (match, p1, p2) => `${p1}${p2.toLowerCase()}`);
}
