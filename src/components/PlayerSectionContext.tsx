import { ChordSong } from "common/ChordModel/ChordSong";
import { findSectionAtTime } from "common/ChordModel/Section";
import { PlayerTimeContext } from "components/PlayerTimeContext";
import React, { useContext, useEffect, useState } from "react";

export const PlayerSectionContext = React.createContext<string>("");

interface PlayerSectionProviderProps {
    song: ChordSong;
    children: React.ReactNode;
}

const PlayerSectionProvider: React.FC<PlayerSectionProviderProps> = (
    props: PlayerSectionProviderProps
) => {
    const getPlayerTimeRef = useContext(PlayerTimeContext);
    const [currentSectionID, setCurrentSectionID] = useState("");

    useEffect(() => {
        const maybeSetNewSectionID = () => {
            const getPlayerTime = getPlayerTimeRef.current;

            const currentTime = getPlayerTime();
            const isBeginningOfSong = currentTime === 0;

            // also avoiding setting an active section for the beginning of the song
            // because it will cause sections to highlight or get labelled when in fact
            // nothing started to play yet
            if (currentTime === null || isBeginningOfSong) {
                if (currentSectionID !== "") {
                    setCurrentSectionID("");
                }

                return;
            }

            const timestampedSections = props.song.timestampedSections;

            const nowTimestampedSection = findSectionAtTime(
                timestampedSections,
                currentTime
            );

            const nowSectionID =
                nowTimestampedSection?.timestampedSection.lineID ?? "";

            const sectionChanged = nowSectionID !== currentSectionID;
            if (!sectionChanged) {
                return;
            }

            setCurrentSectionID(nowSectionID);
        };

        const intervalID = setInterval(maybeSetNewSectionID, 500);

        return () => clearInterval(intervalID);
    }, [props.song, currentSectionID, getPlayerTimeRef]);

    return (
        <PlayerSectionContext.Provider value={currentSectionID}>
            {props.children}
        </PlayerSectionContext.Provider>
    );
};

export default PlayerSectionProvider;
