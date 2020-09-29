import { makeStyles } from "@material-ui/core";
import React from "react";
import blueGrey from "@material-ui/core/colors/blueGrey";

// for data attribute
export const dataSetTabName = "lyrictabtype";
export const dataAttributeTabName: "data-lyrictabtype" = "data-lyrictabtype";

export enum SizedTab {
    SmallTab,
    MediumTab,
    LargeTab,
}

export interface LyricTabType {
    sizedTab: SizedTab;
    serializedStr: "<⑴>" | "<⑵>" | "<⑷>";
    [dataAttributeTabName]: "1" | "2" | "4";
}

export const allTabTypes: LyricTabType[] = [
    {
        sizedTab: SizedTab.SmallTab,
        serializedStr: "<⑴>",
        [dataAttributeTabName]: "1",
    },
    {
        sizedTab: SizedTab.MediumTab,
        serializedStr: "<⑵>",
        [dataAttributeTabName]: "2",
    },
    {
        sizedTab: SizedTab.LargeTab,
        serializedStr: "<⑷>",
        [dataAttributeTabName]: "4",
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

const sizeBasis = 1.5;

const sizeStyleFn = (size: number) => {
    return {
        root: {
            display: "inline-block",
            width: `${sizeBasis * size}em`,
        },
    };
};

const makeSizeStyle = (size: number) => {
    return makeStyles(sizeStyleFn(size));
};

const makeSizeMap = {
    [SizedTab.SmallTab]: makeSizeStyle(1),
    [SizedTab.MediumTab]: makeSizeStyle(2),
    [SizedTab.LargeTab]: makeSizeStyle(4),
};

const useSizeMap = () => {
    // listing explicitly instead of using a loop to let
    // typescript know the available keys
    return {
        [SizedTab.SmallTab]: makeSizeMap[SizedTab.SmallTab](),
        [SizedTab.MediumTab]: makeSizeMap[SizedTab.MediumTab](),
        [SizedTab.LargeTab]: makeSizeMap[SizedTab.LargeTab](),
    };
};

const makeEditingSizeStyle = (size: number) => {
    const style = sizeStyleFn(size);

    return makeStyles({
        root: {
            backgroundColor: blueGrey[100],
            "&:before": {
                content: '"\\a0"',
            },
            margin: "0.05em",
            ...style.root,
        },
    });
};

const makeEditingSizeMap = {
    [SizedTab.SmallTab]: makeEditingSizeStyle(1),
    [SizedTab.MediumTab]: makeEditingSizeStyle(2),
    [SizedTab.LargeTab]: makeEditingSizeStyle(4),
};

const useEditingSizeMap = () => {
    // listing explicitly instead of using a loop to let
    // typescript know the available keys
    return {
        [SizedTab.SmallTab]: makeEditingSizeMap[SizedTab.SmallTab](),
        [SizedTab.MediumTab]: makeEditingSizeMap[SizedTab.MediumTab](),
        [SizedTab.LargeTab]: makeEditingSizeMap[SizedTab.LargeTab](),
    };
};

export type DomLyricTabFn = (sizeType: SizedTab) => Node;

export const useDomLyricTab = (): DomLyricTabFn => {
    const sizeMap = useEditingSizeMap();

    return (sizeType: SizedTab): Node => {
        const node = document.createElement("span");
        node.className = sizeMap[sizeType].root;
        node.contentEditable = "false";

        const tabType = findTabType("sizedTab", sizeType);
        node.dataset[dataSetTabName] = tabType[dataAttributeTabName];

        return node;
    };
};

interface TabProps {
    type: SizedTab;
    edit: boolean;
}

const Tab: React.FC<TabProps> = (props: TabProps): JSX.Element => {
    const normalSizeMap = useSizeMap();
    const editingSizeMap = useEditingSizeMap();

    const sizeMap = props.edit ? editingSizeMap : normalSizeMap;
    const tabType = findTabType("sizedTab", props.type);

    return (
        <span
            className={sizeMap[props.type].root}
            contentEditable="false"
            data-lyrictabtype={tabType[dataAttributeTabName]}
        ></span>
    );
};

export default Tab;
