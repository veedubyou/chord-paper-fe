export type ABLoopMode = "loop" | "rewind" | "disabled";
export const ABLoopDefaultLength = 5;

export interface ABLoop {
    timeA: number | null;
    timeB: number | null;
    mode: ABLoopMode;
}

interface SetABLoop {
    timeA: number;
    timeB: number;
    mode: ABLoopMode;
}

export const isABLoopSet = (abLoop: ABLoop): abLoop is SetABLoop => {
    return abLoop.timeA !== null && abLoop.timeB !== null;
};

export const isPlayableABLoop = (abLoop: SetABLoop): boolean => {
    return abLoop.timeA < abLoop.timeB;
};
