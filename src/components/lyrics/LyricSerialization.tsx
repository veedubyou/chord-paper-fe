import LyricTab from "./LyricTab";
import React from "react";
import * as iots from "io-ts";
import { Lyric } from "../../common/ChordModel/ChordBlock";

// for data attribute
export const dataSetTabName = "lyrictabtype";
export const attributeTabName: "data-lyrictabtype" = "data-lyrictabtype";

export enum SizedTab {
    Size1Tab = 1,
    Size2Tab = 2,
    Size4Tab = 4,
}

interface LyricTabType {
    sizedTab: SizedTab;
    serializedStr: "<⑴>" | "<⑵>" | "<⑷>";
    [attributeTabName]: "1" | "2" | "4";
}

const allTabTypes: LyricTabType[] = [
    {
        sizedTab: SizedTab.Size1Tab,
        serializedStr: "<⑴>",
        [attributeTabName]: "1",
    },
    {
        sizedTab: SizedTab.Size2Tab,
        serializedStr: "<⑵>",
        [attributeTabName]: "2",
    },
    {
        sizedTab: SizedTab.Size4Tab,
        serializedStr: "<⑷>",
        [attributeTabName]: "4",
    },
];

const tabTypeBySerializedStr = (
    serializedStr: LyricTabType["serializedStr"]
): LyricTabType => {
    const tabType: LyricTabType | undefined = allTabTypes.find(
        (tabType: LyricTabType) => tabType.serializedStr === serializedStr
    );

    if (tabType === undefined) {
        throw new Error("Unexpectedly can't find tab type by serialized str");
    }

    return tabType;
};

const tabTypeBySizedTab = (
    sizedTab: LyricTabType["sizedTab"]
): LyricTabType => {
    const tabType: LyricTabType | undefined = allTabTypes.find(
        (tabType: LyricTabType) => tabType.sizedTab === sizedTab
    );

    if (tabType === undefined) {
        throw new Error("Unexpectedly can't find tab type by sized tab");
    }

    return tabType;
};

const tabTypeByAttributeTabName = (
    attributeValue: LyricTabType[typeof attributeTabName]
): LyricTabType => {
    const tabType: LyricTabType | undefined = allTabTypes.find(
        (tabType: LyricTabType) => tabType[attributeTabName] === attributeValue
    );

    if (tabType === undefined) {
        throw new Error(
            "Unexpectedly can't find tab type by attribute tab name"
        );
    }

    return tabType;
};

const isSerializedTab = (
    serializedLyrics: string
): serializedLyrics is LyricTabType["serializedStr"] => {
    for (const tabType of allTabTypes) {
        if (tabType.serializedStr === serializedLyrics) {
            return true;
        }
    }

    return false;
};

const lyricTabTypeOfDOMNode = (node: Node): SizedTab | null => {
    if (
        node instanceof HTMLElement &&
        node.tagName.toLowerCase() === "span" &&
        node.dataset[dataSetTabName] !== undefined
    ) {
        switch (node.dataset[dataSetTabName]) {
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
        return <LyricTab type={tabTypeBySerializedStr(lyrics).sizedTab} />;
    }

    return lyrics;
};

export const deserializeLyrics = (container: Lyric): React.ReactNode => {
    return container.get(deserializeLyricStr);
};

export const serializeLyrics = (childNodes: NodeListOf<ChildNode>): Lyric => {
    let serializedLyrics: string = "";
    childNodes.forEach((childNode: ChildNode) => {
        const tabType: SizedTab | null = lyricTabTypeOfDOMNode(childNode);

        if (tabType !== null) {
            serializedLyrics += tabTypeBySizedTab(tabType).serializedStr;
        } else {
            serializedLyrics += childNode.textContent;
        }
    });

    return new Lyric(serializedLyrics);
};
