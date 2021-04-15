import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { TrackList } from "../../../common/ChordModel/Track";

export interface MultiTrackState {
    currentTrackIndex: number;
    setCurrentTrackIndex: (newIndex: number) => void;
    currentPlayerRef: ReactPlayer | null;
    playerRefs: React.MutableRefObject<React.RefObject<ReactPlayer>[]>;
}

export const useMultiTrack = (trackList: TrackList): MultiTrackState => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

    // syntax bears a bit of explanation - the first use of useRef is just to keep state without rerender
    // (useState would rerender)
    // it's basically keeping a persistent array of refs around
    const playerRefs = useRef<React.RefObject<ReactPlayer>[]>([]);
    const tracks = trackList.tracks;

    const adjustRefArraySize = () => {
        if (tracks.length > playerRefs.current.length) {
            const diff: number = tracks.length - playerRefs.current.length;
            for (let i = 0; i < diff; i++) {
                playerRefs.current.push(React.createRef<ReactPlayer>());
            }
        } else if (tracks.length < playerRefs.current.length) {
            playerRefs.current.splice(tracks.length);
        }
    };
    adjustRefArraySize();

    const currentPlayerRef: ReactPlayer | null =
        playerRefs.current[currentTrackIndex].current;

    return {
        currentTrackIndex: currentTrackIndex,
        setCurrentTrackIndex: setCurrentTrackIndex,
        currentPlayerRef: currentPlayerRef,
        playerRefs: playerRefs,
    };
};
