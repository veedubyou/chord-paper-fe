import { List } from "immutable";
import React from "react";
import { Lyric } from "../../common/ChordModel/Lyric";
import Tab, {
    findTabType,
    isValidTabValue,
    lyricTabTypeOfDOMNode,
    SizedTab,
} from "./Tab";

const deserializeLyricStr = (
    lyrics: string,
    tokenIndex: number,
    edit: boolean
): React.ReactElement | string => {
    if (isValidTabValue("serializedStr", lyrics)) {
        const tabType = findTabType("serializedStr", lyrics);
        return <Tab key={tokenIndex} type={tabType.sizedTab} edit={edit} />;
    }

    return lyrics;
};

export const deserializeLyrics = (
    lyric: Lyric,
    edit: boolean
): (React.ReactElement | string)[] => {
    const nodes: (React.ReactElement | string)[] = [];
    const tokens: List<Lyric> = lyric.tokenize();

    for (let i = 0; i < tokens.size; i++) {
        const token = tokens.get(i);
        if (token === undefined) {
            throw new Error("Token index not found");
        }
        const node: React.ReactElement | string = token.get((lyrics: string) =>
            deserializeLyricStr(lyrics, i, edit)
        );

        // merge strings where possible
        if (
            typeof node === "string" &&
            nodes.length > 0 &&
            typeof nodes[nodes.length - 1] === "string"
        ) {
            nodes[nodes.length - 1] += node;
        } else {
            nodes.push(node);
        }
    }

    return nodes;
};

export const serializeLyrics = (childNodes: NodeListOf<ChildNode>): Lyric => {
    let serializedLyrics: string = "";
    childNodes.forEach((childNode: ChildNode) => {
        const sizedTab: SizedTab | null = lyricTabTypeOfDOMNode(childNode);

        if (sizedTab !== null) {
            const tabType = findTabType("sizedTab", sizedTab);
            serializedLyrics += tabType.serializedStr;
        } else {
            serializedLyrics += childNode.textContent;
        }
    });

    return new Lyric(serializedLyrics);
};
