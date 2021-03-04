import { useState } from "react";
import ReactPlayer from "react-player";
import { Track } from "../../common/ChordModel/Track";
import { PlainFn } from "../../common/PlainFn";

//TODO rename
export interface Track2{
    track: Track,
    ref: React.Ref<ReactPlayer>
}

export const useMultiTrackPlayer = (    trackList: Track[]    ): [number, boolean, (newIndex: number) => void,PlainFn, PlainFn] => {
    const [currTrackIndex, setCurrTrackIndex] = useState(0);
    const [playing, setPlaying] = useState(false);

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);

    return [currTrackIndex, playing, setCurrTrackIndex, handlePlay, handlePause];
}