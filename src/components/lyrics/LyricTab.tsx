import { makeStyles } from "@material-ui/core";
import React from "react";
import { SizedTab, lyricTabTypeName } from "./LyricSerialization";

const useSize1Style = makeStyles({
    root: {
        display: "inline-block",
        width: "1em",
    },
});

const useSize2Style = makeStyles({
    root: {
        display: "inline-block",
        width: "2em",
    },
});

const useSize4Style = makeStyles({
    root: {
        display: "inline-block",
        width: "4em",
    },
});

const useSizeMap = () => {
    const size1Style = useSize1Style();
    const size2Style = useSize2Style();
    const size4Style = useSize4Style();

    return {
        [SizedTab.Size1Tab]: size1Style,
        [SizedTab.Size2Tab]: size2Style,
        [SizedTab.Size4Tab]: size4Style,
    };
};

// this function deliberately takes in a range as opposed to passing back a node
// to prevent it from being used outside the range insertion context
//
// all callers should use the component <LyricTab> wherever possible
export const useInsertLyricTab = (): ((
    range: Range,
    sizeType: SizedTab
) => void) => {
    const sizeMap = useSizeMap();

    return (range: Range, sizeType: SizedTab) => {
        const node = document.createElement("span");
        node.className = sizeMap[sizeType].root;
        node.contentEditable = "false";
        node.dataset[lyricTabTypeName] = sizeType.toString();

        range.insertNode(node);
    };
};

interface LyricTabProps {
    type: SizedTab;
}

const LyricTab: React.FC<LyricTabProps> = (
    props: LyricTabProps
): JSX.Element => {
    const sizeMap = useSizeMap();

    return (
        <span
            className={sizeMap[props.type].root}
            contentEditable="false"
            data-lyrictabtype={props.type.toString()}
        />
    );
};

export default LyricTab;
