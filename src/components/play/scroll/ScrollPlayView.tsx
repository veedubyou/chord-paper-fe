import React from "react";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { PlainFn } from "../../../common/PlainFn";
import ScrollPlayContent from "./ScrollPlayContent";
import ScrollPlayMenu from "./ScrollPlayMenu";

interface ScrollPlayViewProps {
    song: ChordSong;
    onPageView?: PlainFn;
    onEditMode?: PlainFn;
}

const ScrollPlayView: React.FC<ScrollPlayViewProps> = (
    props: ScrollPlayViewProps
): JSX.Element => {
    return (
        <>
            <ScrollPlayMenu
                onPageView={props.onPageView}
                onExit={props.onEditMode}
            />

            <ScrollPlayContent song={props.song} />
        </>
    );
};

export default ScrollPlayView;
