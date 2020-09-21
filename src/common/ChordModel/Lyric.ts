import * as iots from "io-ts";
import { allTabTypes, isValidTabValue } from "../../components/lyrics/Tab";
import { isWhitespace } from "../Whitespace";

export const LyricValidator = iots.type({
    serializedLyric: iots.string,
});

export type LyricValidatedFields = iots.TypeOf<typeof LyricValidator>;

const tokenizationRegex: RegExp = ((): RegExp => {
    let regex = "";
    // add the regex for each special tab "character"
    for (const tabType of allTabTypes) {
        regex += `(${tabType.serializedStr})|`;
    }

    // match each word (with apostrophe inclusive for words like I'm)
    // and all other non-words
    regex += `(\\w|')+|[^w]`;
    regex = `(${regex})`;

    return new RegExp(regex, "g");
})();

export class Lyric {
    private serializedLyric: string;

    constructor(serializedLyrics: string) {
        this.serializedLyric = serializedLyrics;
    }

    get<T>(transformFn: (serializedLyrics: string) => T): T {
        return transformFn(this.serializedLyric);
    }

    tokenize(): Lyric[] {
        const matches = this.serializedLyric.match(tokenizationRegex);
        if (matches === null) {
            return [];
        }

        return matches.map((rawStr: string) => new Lyric(rawStr));
    }

    append(other: Lyric | string) {
        if (typeof other === "string") {
            this.serializedLyric += other;
        } else {
            this.serializedLyric += other.serializedLyric;
        }
    }

    isEmpty(): boolean {
        return this.serializedLyric === "";
    }

    isEntirelySpace(): boolean {
        return (
            isWhitespace(this.serializedLyric) ||
            isValidTabValue("serializedStr", this.serializedLyric)
        );
    }

    isEqual(other: Lyric): boolean {
        return this.serializedLyric === other.serializedLyric;
    }

    static join(arr: Lyric[], joinChar: string): Lyric {
        const rawLyricStrs: string[] = arr.map((container: Lyric) => {
            return container.serializedLyric;
        });

        return new Lyric(rawLyricStrs.join(joinChar));
    }

    static fromValidatedFields(validatedFields: LyricValidatedFields): Lyric {
        return new Lyric(validatedFields.serializedLyric);
    }
}
