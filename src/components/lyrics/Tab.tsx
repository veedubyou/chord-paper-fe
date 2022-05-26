import { css, cx } from "@emotion/css";
import { blueGrey } from "@mui/material/colors";
import React from "react";

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
    serializedStr: "\ue100" | "\ue200" | "\ue400";
    [dataAttributeTabName]: "1" | "2" | "4";
}

export const allTabTypes: LyricTabType[] = [
    {
        sizedTab: SizedTab.SmallTab,
        serializedStr: "\ue100",
        [dataAttributeTabName]: "1",
    },
    {
        sizedTab: SizedTab.MediumTab,
        serializedStr: "\ue200",
        [dataAttributeTabName]: "2",
    },
    {
        sizedTab: SizedTab.LargeTab,
        serializedStr: "\ue400",
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

const makePlainSizeStyle = (size: number) => {
    return {
        display: "inline-block",
        width: `${sizeBasis * size}em`,
    };
};

const makeEditingSizeStyle = (size: number) => {
    const plainStyle = makePlainSizeStyle(size);

    return {
        backgroundColor: blueGrey[100],
        "&:before": {
            content: '"\\a0"',
        },
        // margin: "0.05em",
        ...plainStyle,
    };
};

const plainTabClassNames = {
    [SizedTab.SmallTab]: cx(css(makePlainSizeStyle(1))),
    [SizedTab.MediumTab]: cx(css(makePlainSizeStyle(2))),
    [SizedTab.LargeTab]: cx(css(makePlainSizeStyle(4))),
};

const editableTabClassNames = {
    [SizedTab.SmallTab]: cx(css(makeEditingSizeStyle(1))),
    [SizedTab.MediumTab]: cx(css(makeEditingSizeStyle(2))),
    [SizedTab.LargeTab]: cx(css(makeEditingSizeStyle(4))),
};

export type DomLyricTabFn = (sizeType: SizedTab) => Node;

export const useDomLyricTab = (): DomLyricTabFn => {
    return (sizeType: SizedTab): Node => {
        const node = document.createElement("span");
        node.className = editableTabClassNames[sizeType];
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
    const tabStyles = props.edit ? editableTabClassNames : plainTabClassNames;
    const tabType = findTabType("sizedTab", props.type);

    return (
        <span
            className={tabStyles[props.type]}
            contentEditable="false"
            data-lyrictabtype={tabType[dataAttributeTabName]}
        ></span>
    );
};

export default Tab;
