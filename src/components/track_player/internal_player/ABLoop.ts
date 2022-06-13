import { Either, left, right } from "fp-ts/lib/Either";
import { Record } from "immutable";

export type ABLoopMode = "loop" | "rewind" | "disabled";

type DefaultPointB = {
    type: "defaultLength";
    loopLength: 5;
};

type CustomPointB = {
    type: "custom";
    time: number | null;
};

type ABLoopRecordType = {
    timeA: number | null;
    timeB: DefaultPointB | CustomPointB;
    mode: ABLoopMode;
};

const DefaultRecord: ABLoopRecordType = {
    timeA: null,
    timeB: { type: "custom", time: null },
    mode: "disabled",
};

const RecordConstructor = Record(DefaultRecord);
type ABLoopRecord = ReturnType<typeof RecordConstructor>;

export class ABLoop {
    readonly record: ABLoopRecord;

    static empty(): ABLoop {
        return new ABLoop(RecordConstructor(DefaultRecord));
    }

    constructor(record: ABLoopRecord) {
        this.record = record;
    }

    get timeA(): number | null {
        return this.record.timeA;
    }

    get timeB(): number | null {
        if (this.record.timeB.type === "custom") {
            return this.record.timeB.time;
        }

        const timeA = this.timeA;
        if (timeA === null) {
            return null;
        }

        return timeA + this.record.timeB.loopLength;
    }

    get mode(): ABLoopMode {
        return this.record.mode;
    }

    private setAWithoutCheck(newTimeA: number | null): ABLoop {
        const newRecord = this.record.set("timeA", newTimeA);
        return new ABLoop(newRecord);
    }

    setA(newTimeA: number | null): Either<Error, ABLoop> {
        const newLoop = this.setAWithoutCheck(newTimeA);
        if (newLoop.isInvalid()) {
            return left(new Error("Point A must be before Point B"));
        }

        return right(newLoop);
    }

    clearA(): ABLoop {
        return this.setAWithoutCheck(null);
    }

    private setBWithoutCheck(newTimeB: number | null): ABLoop {
        const newRecord = this.record.set("timeB", {
            type: "custom",
            time: newTimeB,
        });
        return new ABLoop(newRecord);
    }

    setB(newTimeB: number | null): Either<Error, ABLoop> {
        const newLoop = this.setBWithoutCheck(newTimeB);
        if (newLoop.isInvalid()) {
            return left(new Error("Point B must be after Point A"));
        }

        return right(newLoop);
    }

    clearB(): ABLoop {
        return this.setBWithoutCheck(null);
    }

    setDefaultLoop(): ABLoop {
        const newRecord = this.record.set("timeB", {
            type: "defaultLength",
            loopLength: 5,
        });
        return new ABLoop(newRecord);
    }

    isDefaultLoop(): boolean {
        return this.record.timeB.type === "defaultLength";
    }

    setMode(newMode: ABLoopMode): ABLoop {
        const newRecord = this.record.set("mode", newMode);
        return new ABLoop(newRecord);
    }

    isSet(): this is this & { timeA: number } & { timeB: number } {
        return this.timeA !== null && this.timeB !== null;
    }

    isInvalid(): boolean {
        if (!this.isSet()) {
            return false;
        }

        return this.timeA >= this.timeB;
    }

    isPlayable(): boolean {
        return this.isSet() && !this.isInvalid();
    }

    isOutsideLoop(timestamp: number): boolean {
        if (!this.isSet()) {
            return false;
        }

        return timestamp < this.timeA || timestamp >= this.timeB;
    }
}
