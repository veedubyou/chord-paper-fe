import { Either, isLeft, left, parseJSON, right } from "fp-ts/lib/Either";
import * as iots from "io-ts";
import lodash from "lodash";
import shortid from "shortid";
import { IDable } from "./Collection";
import { Lyric, LyricValidator } from "./Lyric";
import { List, Record } from "immutable";

interface ChordBlockConstructorParams {
    chord: string;
    lyric: Lyric;
}

export const ChordBlockValidator = iots.type({
    chord: iots.string,
    lyric: LyricValidator,
    type: iots.literal("ChordBlock"),
});

export type ChordBlockValidatedFields = iots.TypeOf<typeof ChordBlockValidator>;

type RecordType = {
    id: string;
    chord: string;
    lyric: Lyric;
    type: "ChordBlock";
};

const DefaultRecord: RecordType = {
    id: "",
    chord: "",
    lyric: new Lyric(""),
    type: "ChordBlock" as "ChordBlock",
};

const RecordConstructor = Record(DefaultRecord);
type ChordBlockRecord = ReturnType<typeof RecordConstructor>;

export class ChordBlock implements IDable<ChordBlock> {
    readonly record: ChordBlockRecord;

    constructor(params: ChordBlockConstructorParams | ChordBlockRecord) {
        if (ChordBlock.isChordBlockRecord(params)) {
            this.record = params;
            return;
        }

        let { chord, lyric } = params;

        this.record = new RecordConstructor({
            id: shortid.generate(),
            chord: chord,
            lyric: lyric,
            type: "ChordBlock",
        });
    }

    static isChordBlockRecord(
        params: ChordBlockConstructorParams | ChordBlockRecord
    ): params is ChordBlockRecord {
        return Record.isRecord(params);
    }

    get id(): string {
        return this.record.id;
    }

    get lyric(): Lyric {
        return this.record.lyric;
    }

    get chord(): string {
        return this.record.chord;
    }

    get type(): "ChordBlock" {
        return this.record.type;
    }

    private new(maybeNew: ChordBlockRecord): ChordBlock {
        if (maybeNew === this.record) {
            return this;
        }

        return new ChordBlock(maybeNew);
    }

    set<K extends keyof RecordType>(key: K, value: RecordType[K]): ChordBlock {
        const newRecord = this.record.set(key, value);
        return this.new(newRecord);
    }

    update<K extends keyof RecordType>(
        key: K,
        updater: (value: RecordType[K]) => RecordType[K]
    ): ChordBlock {
        const newRecord = this.record.update(key, updater);
        return this.new(newRecord);
    }

    toJSON(): object {
        const plainObject = this.record.toJS();
        return lodash.omit(plainObject, "id");
    }

    static fromValidatedFields(
        validatedFields: ChordBlockValidatedFields
    ): ChordBlock {
        const unionLyric = validatedFields.lyric;
        const serializedLyric = Lyric.fromValidatedFields(unionLyric);

        return new ChordBlock({
            chord: validatedFields.chord,
            lyric: serializedLyric,
        });
    }

    static deserialize(jsonStr: string): Either<Error, ChordBlock> {
        const result: Either<Error, unknown> = parseJSON(
            jsonStr,
            () => new Error("Failed to parse json string")
        );

        if (isLeft(result)) {
            return result;
        }

        const jsonObj = result.right;
        const validationResult = ChordBlockValidator.decode(jsonObj);

        if (isLeft(validationResult)) {
            return left(new Error("Invalid Chord Block object"));
        }

        const unionLyric = validationResult.right.lyric;
        const serializedLyric = Lyric.fromValidatedFields(unionLyric);

        return right(
            new ChordBlock({
                chord: validationResult.right.chord,
                lyric: serializedLyric,
            })
        );
    }

    get lyricTokens(): List<Lyric> {
        return this.lyric.tokenize();
    }

    // splits a block, and returns the block before
    // e.g.
    // {id:"A", chord: "B7", lyric:"my dear we're"}
    // splitBlock(4) =>
    // {id:"B", chord: "B7", lyric:"my dear "}
    // {id:"A", chord: "", "we're"}
    splitByTokenIndex(splitIndex: number): [ChordBlock, ChordBlock] {
        if (splitIndex === 0) {
            throw new Error("Split index can't be zero");
        }

        const tokens = this.lyricTokens;
        const prevBlockLyricTokens = tokens.slice(0, splitIndex);
        const thisBlockLyricTokens = tokens.slice(splitIndex);

        const prevBlock: ChordBlock = new ChordBlock({
            chord: this.chord,
            lyric: Lyric.join(prevBlockLyricTokens, ""),
        });

        const newCurrBlock: ChordBlock = this.set("chord", "").set(
            "lyric",
            Lyric.join(thisBlockLyricTokens, "")
        );

        return [prevBlock, newCurrBlock];
    }

    splitByCharIndex(splitIndex: number): [ChordBlock, ChordBlock] {
        if (splitIndex === 0) {
            return [new ChordBlock({ chord: "", lyric: new Lyric("") }), this];
        }

        const lyricString: string = this.lyric.get((s: string) => s);
        const prevBlockLyrics: Lyric = new Lyric(
            lyricString.slice(0, splitIndex)
        );
        const thisBlockLyrics: Lyric = new Lyric(lyricString.slice(splitIndex));

        const prevBlock: ChordBlock = new ChordBlock({
            chord: this.chord,
            lyric: prevBlockLyrics,
        });

        const newCurrBlock = this.set("chord", "").set(
            "lyric",
            thisBlockLyrics
        );

        return [prevBlock, newCurrBlock];
    }

    contentEquals(other: ChordBlock): boolean {
        return this.chord === other.chord && this.lyric.isEqual(other.lyric);
    }

    isEmpty(): boolean {
        return this.chord === "" && this.lyric.isEmpty();
    }

    lyricLength(): number {
        const lyricString = this.lyric.get((s: string) => s);
        return lyricString.length;
    }
}
