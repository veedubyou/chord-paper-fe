import { getOrElse, isLeft } from "fp-ts/lib/Either";
import { ChordBlock } from "../ChordBlock";

describe("ChordBlock", () => {
    describe("de/serialization", () => {
        const testBlock = (): ChordBlock => {
            return new ChordBlock({ chord: "A7", lyric: "We're no " });
        };
        const failBlock = (): ChordBlock => {
            expect(false).toEqual(true);
            return new ChordBlock({ chord: "", lyric: "" });
        };

        test("serializes and deserializes correctly", () => {
            const original = testBlock();
            const json = original.serialize();
            const result = ChordBlock.deserialize(json);

            const deserialized: ChordBlock = getOrElse(failBlock)(result);
            expect(deserialized).toMatchObject({
                chord: "A7",
                lyric: "We're no ",
            });
        });

        test("fails deserialization correctly for malformed JSON", () => {
            const result = ChordBlock.deserialize(
                `{"chord:"A7","lyric":"We're no ","type":"ChordBlock"}`
            );
            expect(isLeft(result)).toEqual(true);
        });

        describe("deserializing invalid object shape", () => {
            test("fails type field check", () => {
                const result = ChordBlock.deserialize(
                    `{"chord":"A7","lyric":"We're no ","type":"ChordLine"}`
                );
                expect(isLeft(result)).toEqual(true);
            });

            test("fails missing chord check", () => {
                const result = ChordBlock.deserialize(
                    `{"lyric":"We're no ","type":"ChordBlock"}`
                );
                expect(isLeft(result)).toEqual(true);
            });

            test("fails missing lyric check", () => {
                const result = ChordBlock.deserialize(
                    `{"chord":"A7","type":"ChordBlock"}`
                );
                expect(isLeft(result)).toEqual(true);
            });
        });
    });

    describe("contentEquals", () => {
        describe("with content", () => {
            let original: ChordBlock;
            beforeEach(() => {
                original = new ChordBlock({
                    chord: "A7",
                    lyric: "Twinkle twinkle little star",
                });
            });

            test("passes if the same", () => {
                const other = new ChordBlock({
                    chord: "A7",
                    lyric: "Twinkle twinkle little star",
                });
                expect(original.contentEquals(other)).toEqual(true);
            });

            test("fails if chords different", () => {
                const other = new ChordBlock({
                    chord: "Am",
                    lyric: "Twinkle twinkle little star",
                });
                expect(original.contentEquals(other)).toEqual(false);
            });

            test("fails if lyrics different", () => {
                const other = new ChordBlock({
                    chord: "A7",
                    lyric: "Twinkle twinkle little planet",
                });
                expect(original.contentEquals(other)).toEqual(false);
            });
        });

        describe("without content", () => {
            let original: ChordBlock;
            beforeEach(() => {
                original = new ChordBlock({
                    chord: "",
                    lyric: "",
                });
            });
            test("passes if the same", () => {
                const other = new ChordBlock({
                    chord: "",
                    lyric: "",
                });
                expect(original.contentEquals(other)).toEqual(true);
            });

            test("fails if chords different", () => {
                const other = new ChordBlock({
                    chord: "Am",
                    lyric: "",
                });
                expect(original.contentEquals(other)).toEqual(false);
            });

            test("fails if lyrics different", () => {
                const other = new ChordBlock({
                    chord: "",
                    lyric: "Twinkle twinkle little planet",
                });
                expect(original.contentEquals(other)).toEqual(false);
            });
        });
    });
});
