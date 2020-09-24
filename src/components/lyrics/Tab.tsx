import { makeStyles } from "@material-ui/core";
import React from "react";

// for data attribute
export const dataSetTabName = "lyrictabtype";
export const dataAttributeTabName: "data-lyrictabtype" = "data-lyrictabtype";

export enum SizedTab {
    Size1Tab = 1,
    Size2Tab = 2,
}

export interface LyricTabType {
    sizedTab: SizedTab;
    serializedStr: "<⑴>" | "<⑵>";
    [dataAttributeTabName]: "1" | "2";
}

export const allTabTypes: LyricTabType[] = [
    {
        sizedTab: SizedTab.Size1Tab,
        serializedStr: "<⑴>",
        [dataAttributeTabName]: "1",
    },
    {
        sizedTab: SizedTab.Size2Tab,
        serializedStr: "<⑵>",
        [dataAttributeTabName]: "2",
    },
];

export const findTabType = <T extends keyof LyricTabType>(
    attrName: T,
    attr: LyricTabType[T]
): LyricTabType => {
    const tabType: LyricTabType | undefined = allTabTypes.find(
        (tabType: LyricTabType) => tabType[attrName] === attr
    );

    if (tabType === undefined) {
        throw new Error(`Unexpectedly can't find tab type by ${attrName}`);
    }

    return tabType;
};

export const isValidTabValue = <T extends keyof LyricTabType>(
    attrName: T,
    attr: any
): attr is LyricTabType[T] => {
    const tabType: LyricTabType | undefined = allTabTypes.find(
        (tabType: LyricTabType) => tabType[attrName] === attr
    );

    return tabType !== undefined;
};

export const lyricTabTypeOfDOMNode = (node: Node): SizedTab | null => {
    if (node instanceof HTMLElement && node.tagName.toLowerCase() === "span") {
        const dataAttribute = node.dataset[dataSetTabName];

        if (isValidTabValue(dataAttributeTabName, dataAttribute)) {
            const tabType = findTabType(dataAttributeTabName, dataAttribute);
            return tabType.sizedTab;
        }
    }

    return null;
};

const makeSizeStyle = (size: number) => {
    const sizeBasis = 1.5;

    return makeStyles({
        root: {
            display: "inline-block",
            width: `${sizeBasis * size}em`,
        },
    });
};

const useSize1Style = makeSizeStyle(1);
const useSize2Style = makeSizeStyle(2);

const useSizeMap = () => {
    const size1Style = useSize1Style();
    const size2Style = useSize2Style();

    return {
        [SizedTab.Size1Tab]: size1Style,
        [SizedTab.Size2Tab]: size2Style,
    };
};

export const useDomLyricTab = (): ((sizeType: SizedTab) => Node) => {
    const sizeMap = useSizeMap();

    return (sizeType: SizedTab): Node => {
        const node = document.createElement("span");
        node.className = sizeMap[sizeType].root;
        node.contentEditable = "false";
        node.dataset[dataSetTabName] = sizeType.toString();

        return node;
    };
};

interface TabProps {
    type: SizedTab;
}

const Tab: React.FC<TabProps> = (props: TabProps): JSX.Element => {
    const sizeMap = useSizeMap();

    return (
        <span
            className={sizeMap[props.type].root}
            contentEditable="false"
            data-lyrictabtype={props.type.toString()}
        />
    );
};

export default Tab;
