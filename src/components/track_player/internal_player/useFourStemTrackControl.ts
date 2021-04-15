import { FourStemsTrack } from "../../../common/ChordModel/Track";
import * as Tone from "tone";
import { useMemo } from "react";

interface LoadingState {
    state: "loading";
}

interface LoadedState {
    state: "loaded";
    url: string;
}

interface BaseFourStemTrackControl {
    trackType: "4stems";
}

export type FourStemTrackControl = BaseFourStemTrackControl &
    (LoadedState | LoadingState);

type FourStemTrackControlMaker = (
    track: FourStemsTrack
) => FourStemTrackControl;

export const useFourStemTrackControl = (): FourStemTrackControlMaker => {
    return (track: FourStemsTrack) => {
        useMemo(() => {
            const bass = new Tone.Player(track.stems.bass_url)
                .toDestination()
                .sync()
                .start(0);
            const drums = new Tone.Player(track.stems.drums_url)
                .toDestination()
                .sync()
                .start(0);
            const other = new Tone.Player(track.stems.other_url)
                .toDestination()
                .sync()
                .start(0);
            const vocals = new Tone.Player(track.stems.vocals_url)
                .toDestination()
                .sync()
                .start(0);

            const go = async () => {
                await Tone.loaded();
                Tone.Transport.start();
            };

            go();
        }, [
            track.stems.bass_url,
            track.stems.drums_url,
            track.stems.other_url,
            track.stems.vocals_url,
        ]);

        return {
            trackType: "4stems",
            state: "loading",
        };
    };
};
