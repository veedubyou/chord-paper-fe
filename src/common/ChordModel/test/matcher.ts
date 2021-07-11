import { boolean } from "io-ts";
import { ChordBlock } from "../ChordBlock";
import { ChordLine, Section } from "../ChordLine";
import { ChordSong, SongSummary } from "../ChordSong";

type BlockMatcherFields = {
    chord: string;
    lyric: string;
};

type LineMatcherFields = {
    blocks: BlockMatcherFields[];
    section?: Section;
};

type SongMatcherFields = {
    lines: LineMatcherFields[];
    summary?: SongSummary;
};

declare global {
    namespace jest {
        interface Matchers<R> {
            toMatchBlock: (fields: BlockMatcherFields) => CustomMatcherResult;
            toMatchLine: (fields: LineMatcherFields) => CustomMatcherResult;
            toMatchSong: (fields: SongMatcherFields) => CustomMatcherResult;
        }
    }
}

type EqualFn = (a: any, b: any) => boolean;

function toMatchBlock(
    received: ChordBlock,
    expected: BlockMatcherFields
): jest.CustomMatcherResult {
    if (received.chord !== expected.chord) {
        return {
            pass: false,
            message: () =>
                `Chord: expected ${expected.chord}, got ${received.chord}`,
        };
    }

    const serializedLyric: string = received.lyric.get((s) => s);
    if (serializedLyric !== expected.lyric) {
        return {
            pass: false,
            message: () =>
                `Lyric: expected ${expected.lyric}, got ${serializedLyric}`,
        };
    }

    return {
        pass: true,
        message: () => "Matches",
    };
}

function toMatchLine(
    equalFn: EqualFn,
    received: ChordLine,
    expected: LineMatcherFields
): jest.CustomMatcherResult {
    if (received.chordBlocks.length !== expected.blocks.length) {
        return {
            pass: false,
            message: () =>
                `Mismatched block lengths: expected ${expected.blocks.length}, received: ${received.chordBlocks.length}`,
        };
    }

    for (let i = 0; i < received.chordBlocks.length; i++) {
        const block = received.chordBlocks.getAtIndex(i);
        const matchResult = toMatchBlock(block, expected.blocks[i]);
        if (!matchResult.pass) {
            return {
                pass: false,
                message: () => `Block #${i}: ${matchResult.message()}`,
            };
        }
    }

    if (expected.section !== undefined) {
        const match = equalFn(received.section, expected.section);
        if (!match) {
            return {
                pass: false,
                message: () => `Section does not match`,
            };
        }
    }

    return {
        pass: true,
        message: () => "Matches",
    };
}

function toMatchSong(
    equalFn: EqualFn,
    received: ChordSong,
    expected: SongMatcherFields
): jest.CustomMatcherResult {
    if (received.chordLines.length !== expected.lines.length) {
        return {
            pass: false,
            message: () =>
                `Mismatched line lengths: expected ${expected.lines.length}, received: ${received.chordLines.length}`,
        };
    }

    for (let i = 0; i < received.chordLines.length; i++) {
        const line = received.chordLines.getAtIndex(i);
        const matchResult = toMatchLine(equalFn, line, expected.lines[i]);
        if (!matchResult.pass) {
            return {
                pass: false,
                message: () => `Line #${i}: ${matchResult.message()}`,
            };
        }
    }

    if (expected.summary !== undefined) {
        if (received.id !== expected.summary.id) {
            const message = `ID: expected ${expected.summary.id}, got ${received.id}`;
            return {
                pass: false,
                message: () => message,
            };
        }

        if (received.owner !== expected.summary.owner) {
            const message = `Owner: expected ${expected.summary.owner}, got ${received.owner}`;
            return {
                pass: false,
                message: () => message,
            };
        }

        if (received.lastSavedAt !== expected.summary.lastSavedAt) {
            const match = equalFn(
                received.lastSavedAt,
                expected.summary.lastSavedAt
            );
            if (!match) {
                return {
                    pass: false,
                    message: () => `LastSavedAt does not match`,
                };
            }
        }

        const match = equalFn(received.metadata, expected.summary.metadata);
        if (!match) {
            return {
                pass: false,
                message: () => `Metadata does not match`,
            };
        }
    }

    return {
        pass: true,
        message: () => "Matches",
    };
}

expect.extend({
    toMatchBlock(
        ...params: Parameters<typeof toMatchBlock>
    ): jest.CustomMatcherResult {
        this.equals;
        return toMatchBlock(...params);
    },

    toMatchLine(
        received: ChordLine,
        expected: LineMatcherFields
    ): jest.CustomMatcherResult {
        return toMatchLine(this.equals, received, expected);
    },

    toMatchSong(
        received: ChordSong,
        expected: SongMatcherFields
    ): jest.CustomMatcherResult {
        return toMatchSong(this.equals, received, expected);
    },
});

export default null;
