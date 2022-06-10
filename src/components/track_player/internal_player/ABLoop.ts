export type ABLoopMode = "loop" | "rewind" | "disabled";
export const ABLoopDefaultLength = 5;

export interface ABLoop {
    timeA: number | null;
    mode: ABLoopMode;
}
