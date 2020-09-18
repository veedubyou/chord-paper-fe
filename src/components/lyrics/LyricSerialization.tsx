import LyricTab from "./LyricTab";
import React from "react";
import * as iots from "io-ts";

// for data attribute
export const lyricTabTypeName = "lyrictabtype";

type SerializedTab = "<⑴>" | "<⑵>" | "<⑷>";

export enum SizedTab {
    Size1Tab = 1,
    Size2Tab = 2,
    Size4Tab = 4,
}

interface LyricTabTypes {
    sizedTab: SizedTab;
    serializedStr: SerializedTab;
    "data-lyrictabtype": "1" | "2" | "4";
}

const allTabTypes: LyricTabTypes[] = [
    {
        sizedTab: SizedTab.Size1Tab,
        serializedStr: "<⑴>",
        "data-lyrictabtype": "1",
    },
    {
        sizedTab: SizedTab.Size2Tab,
        serializedStr: "<⑵>",
        "data-lyrictabtype": "2",
    },
    {
        sizedTab: SizedTab.Size4Tab,
        serializedStr: "<⑷>",
        "data-lyrictabtype": "4",
    },
];

const nodeSizeToSerializedLyrics = {
    [SizedTab.Size1Tab]: "<⑴>",
    [SizedTab.Size2Tab]: "<⑵>",
    [SizedTab.Size4Tab]: "<⑷>",
};

const serializedToNodeSize = {
    "<⑴>": SizedTab.Size1Tab,
    "<⑵>": SizedTab.Size2Tab,
    "<⑷>": SizedTab.Size4Tab,
};

export const SerializedLyricsValidator = iots.type({
    serializedLyrics: iots.string,
});

export type SerializedLyricsValidatedFields = iots.TypeOf<
    typeof SerializedLyricsValidator
>;

export class SerializedLyrics {
    private serializedLyrics: string;

    constructor(serializedLyrics: string) {
        this.serializedLyrics = serializedLyrics;
    }

    get<T>(transformFn: (serializedLyrics: string) => T): T {
        return transformFn(this.serializedLyrics);
    }

    static fromValidatedFields(
        validatedFields: SerializedLyricsValidatedFields
    ): SerializedLyrics {
        return new SerializedLyrics(validatedFields.serializedLyrics);
    }
}

const isSerializedTab = (
    serializedLyrics: string
): serializedLyrics is keyof typeof serializedToNodeSize => {
    return serializedLyrics in serializedToNodeSize;
};

const lyricTabTypeOfDOMNode = (node: Node): SizedTab | null => {
    if (
        node instanceof HTMLElement &&
        node.tagName.toLowerCase() === "span" &&
        node.dataset[lyricTabTypeName] !== undefined
    ) {
        switch (node.dataset[lyricTabTypeName]) {
            case "1":
                return SizedTab.Size1Tab;
            case "2":
                return SizedTab.Size2Tab;
            case "4":
                return SizedTab.Size4Tab;
            default:
                throw new Error("unexpected value inside lyrictabtype");
        }
    }

    return null;
};

const deserializeLyricStr = (lyrics: string): React.ReactNode => {
    if (isSerializedTab(lyrics)) {
        return <LyricTab type={serializedToNodeSize[lyrics]} />;
    }

    return lyrics;
};

export const deserializeLyrics = (
    container: SerializedLyrics
): React.ReactNode => {
    return container.get(deserializeLyricStr);
};

export const serializeLyrics = (
    childNodes: NodeListOf<ChildNode>
): SerializedLyrics => {
    let serializedLyrics: string = "";
    childNodes.forEach((childNode: ChildNode) => {
        const tabType: SizedTab | null = lyricTabTypeOfDOMNode(childNode);

        if (tabType !== null) {
            serializedLyrics += nodeSizeToSerializedLyrics[tabType];
        } else {
            serializedLyrics += childNode.textContent;
        }
    });

    return new SerializedLyrics(serializedLyrics);
};
