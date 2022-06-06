import { ChordSong } from "common/ChordModel/ChordSong";
import { PlainFn } from "common/PlainFn";
import ScrollPlayContent from "components/play/scroll/ScrollPlayContent";
import ScrollPlayMenu from "components/play/scroll/ScrollPlayMenu";
import React from "react";

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
