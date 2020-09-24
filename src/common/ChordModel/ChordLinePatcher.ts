import { ChordLine } from "./ChordLine";
import { ChordBlock } from "./ChordBlock";
import { DiffMatchPatch, DiffOperation } from "diff-match-patch-typescript";
import { Lyric } from "./Lyric";

const differ: DiffMatchPatch = (() => {
    const dmp = new DiffMatchPatch();
    dmp.diffTimeout = 0;
    dmp.matchThreshold = 0;
    return dmp;
})();

// we know what we're doing here - the raw serialized string is to be compared
const rawStringGetter = (lyrics: string) => lyrics;

class ChordLineIterator {
    private chordLine: ChordLine;
    private currBlockIndex: number;
    private currCharIndex: number;
    private blockBuffer: string[];
    private prependLyrics: string;

    constructor(chordLine: ChordLine) {
        this.chordLine = chordLine;

        this.currBlockIndex = 0;
        this.currCharIndex = 0;

        this.blockBuffer = chordLine.elements.map(() => "");
        this.prependLyrics = "";
    }

    private atBlockBoundary(): boolean {
        return this.currCharIndex === 0;
    }

    private currentBlock(): ChordBlock {
        return this.chordLine.elements[this.currBlockIndex];
    }

    private currentRawLyrics(): string {
        return this.currentBlock().lyric.get(rawStringGetter);
    }

    private currentChar(): string {
        return this.currentRawLyrics().charAt(this.currCharIndex);
    }

    private nextChar(): void {
        this.currCharIndex += 1;

        if (this.currCharIndex >= this.currentRawLyrics().length) {
            this.currBlockIndex += 1;
            this.currCharIndex = 0;
        }
    }

    skip(skipChar: string): void {
        if (this.currentChar() !== skipChar) {
            throw new Error("Mismatched characters when skipping");
        }

        this.blockBuffer[this.currBlockIndex] += skipChar;

        this.nextChar();
    }

    insert(insertChar: string): void {
        if (!this.atBlockBoundary()) {
            this.blockBuffer[this.currBlockIndex] += insertChar;
        } else {
            // bias towards inserting  at the end of the previous block if between two blocks
            // since chords are aligned to the beginning of the block, we don't want to shift the lyrics
            // inside a block unnecessarily
            const prevBlockIndex = this.currBlockIndex - 1;
            if (prevBlockIndex >= 0) {
                this.blockBuffer[prevBlockIndex] += insertChar;
            } else {
                this.prependLyrics += insertChar;
            }
        }
    }

    delete(deleteChar: string): void {
        if (this.currentChar() !== deleteChar) {
            throw new Error("Mismatched characters when deleting");
        }

        this.nextChar();
    }

    finish(): void {
        for (let i = 0; i < this.chordLine.elements.length; i++) {
            this.chordLine.elements[i].lyric = new Lyric(this.blockBuffer[i]);
        }

        if (this.prependLyrics !== "") {
            this.chordLine.elements.splice(
                0,
                0,
                new ChordBlock({
                    chord: "",
                    lyric: new Lyric(this.prependLyrics),
                })
            );
        }

        this.chordLine.normalizeBlocks();
    }
}

const removeOrphanedBlocksWithNoChords = (chordLine: ChordLine): void => {
    const newBlocks: ChordBlock[] = [];

    for (const block of chordLine.elements) {
        if (!block.lyric.isEmpty() || block.chord !== "") {
            newBlocks.push(block);
        }
    }

    chordLine.elements = newBlocks;
};

const addSpacesToOrphanedBlocks = (chordLine: ChordLine): void => {
    const blocks: ChordBlock[] = chordLine.elements;
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (!block.lyric.isEmpty()) {
            continue;
        }

        const prevBlockHasSpaceToSteal =
            i > 0 &&
            blocks[i - 1].lyric.get((rawStr: string): boolean => {
                return rawStr.length > 1 && rawStr.endsWith(" ");
            });

        if (prevBlockHasSpaceToSteal) {
            // "steal" a space from the previous block
            // e.g. if * represents a space
            // G        A
            // We're*no*strangers
            // replaced with
            // We're*no*
            // instead of adding two spaces consecutively, like
            // G        A
            // We're*no**
            // we'll just relegate one of the unused spaces for the orphaned block, like
            // G       A
            // We're*no*

            // if there's no space to steal, just add one so that it's backed by a character
            const prevBlock = blocks[i - 1];

            const modifiedRawLyric = prevBlock.lyric.get(
                (rawStr: string): string => {
                    const lastIndex = rawStr.length - 1;
                    return rawStr.slice(0, lastIndex);
                }
            );
            prevBlock.lyric = new Lyric(modifiedRawLyric);
        }

        block.lyric = new Lyric(" ");
    }
};

export const replaceChordLineLyrics = (
    chordLine: ChordLine,
    newLyrics: Lyric
): void => {
    const currRawLyrics = chordLine.lyrics.get(rawStringGetter);
    const newRawLyrics = newLyrics.get(rawStringGetter);

    const diffs = differ.diff_main(currRawLyrics, newRawLyrics);
    differ.diff_cleanupSemanticLossless(diffs);

    const iterator = new ChordLineIterator(chordLine);

    for (const diff of diffs) {
        const diffOperation = diff[0];
        for (const diffChar of diff[1]) {
            switch (diffOperation) {
                case DiffOperation.DIFF_EQUAL: {
                    iterator.skip(diffChar);
                    break;
                }
                case DiffOperation.DIFF_INSERT: {
                    iterator.insert(diffChar);
                    break;
                }
                case DiffOperation.DIFF_DELETE: {
                    iterator.delete(diffChar);
                    break;
                }
            }
        }
    }

    iterator.finish();

    removeOrphanedBlocksWithNoChords(chordLine);
    addSpacesToOrphanedBlocks(chordLine);
};
