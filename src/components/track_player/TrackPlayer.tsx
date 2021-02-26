import React, { useState } from "react";
import CollapsedButton from "./CollapsedButton";
import FullSizedPlayer from "./FullSizedPlayer";

type PlayerVisibilityState = "collapsed" | "full";

interface TrackPlayerProps {
    url: string;
    collapsedButtonClassName?: string;
}

const TrackPlayer: React.FC<TrackPlayerProps> = (
    props: TrackPlayerProps
): JSX.Element => {
    const [playerVisibilityState, setPlayerVisibilityState] = useState<
        PlayerVisibilityState
    >("collapsed");

    const collapsedButton = (
        <CollapsedButton
            className={props.collapsedButtonClassName}
            show={playerVisibilityState === "collapsed"}
            onExpand={() => setPlayerVisibilityState("full")}
        />
    );

    const fullPlayer = (
        <FullSizedPlayer
            show={playerVisibilityState === "full"}
            url={props.url}
            onCollapse={() => setPlayerVisibilityState("collapsed")}
        />
    );

    return (
        <>
            {collapsedButton}
            {fullPlayer}
        </>
    );
};

export default TrackPlayer;
