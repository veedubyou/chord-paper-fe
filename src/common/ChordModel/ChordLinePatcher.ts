import { DiffMatchPatch, DiffOperation } from "diff-match-patch-typescript";
import { findTabType, SizedTab } from "components/lyrics/Tab";
import { ChordBlock } from "common/ChordModel/ChordBlock";
import { ChordLine } from "common/ChordModel/ChordLine";
import { Collection } from "common/ChordModel/Collection";
import { Lyric } from "common/ChordModel/Lyric";

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

        this.blockBuffer = chordLine.chordBlocks.list.map(() => "").toArray();
        this.prependLyrics = "";
    }

    private atBlockBoundary(): boolean {
        return this.currCharIndex === 0;
    }

    private currentBlock(): ChordBlock {
        return this.chordLine.getElementAtIndex(this.currBlockIndex);
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
            // bias towards inserting at the end of the previous block if between two blocks
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

    finish(): ChordLine {
        this.chordLine = this.chordLine.updateAllElements((block, index) => {
            const lyric = new Lyric(this.blockBuffer[index]);
            return block.set("lyric", lyric);
        });

        if (this.prependLyrics !== "") {
            this.chordLine = this.chordLine.addBeginning(
                new ChordBlock({
                    chord: "",
                    lyric: new Lyric(this.prependLyrics),
                })
            );
        }

        return this.chordLine.normalizeBlocks();
    }
}

const removeOrphanedBlocksWithNoChords = (chordLine: ChordLine): ChordLine => {
    const newBlocks: ChordBlock[] = [];

    for (const block of chordLine.chordBlocks.toArray()) {
        if (!block.lyric.isEmpty() || block.chord !== "") {
            newBlocks.push(block);
        }
    }

    return chordLine.updateCollection(() => new Collection(newBlocks));
};

const orphanTab: string = findTabType(
    "sizedTab",
    SizedTab.SmallTab
).serializedStr;

const addTabsToOrphanedBlocks = (chordLine: ChordLine): ChordLine => {
    const orphanTabBlockIfEmpty = (block: ChordBlock): ChordBlock => {
        if (!block.lyric.isEmpty()) {
            return block;
        }

        return block.set("lyric", new Lyric(orphanTab));
    };

    return chordLine.updateAllElements(orphanTabBlockIfEmpty);
};

export const replaceChordLineLyrics = (
    chordLine: ChordLine,
    newLyrics: Lyric
): ChordLine => {
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

    chordLine = iterator.finish();

    chordLine = removeOrphanedBlocksWithNoChords(chordLine);
    chordLine = addTabsToOrphanedBlocks(chordLine);
    return chordLine;
};
