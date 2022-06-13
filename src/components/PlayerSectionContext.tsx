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
            if (getPlayerTime === null) {
                return;
            }

            const currentTime = getPlayerTime();
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

        const intervalID = setInterval(maybeSetNewSectionID, 1000);

        return () => clearInterval(intervalID);
    }, [props.song, currentSectionID, getPlayerTimeRef]);

    return (
        <PlayerSectionContext.Provider value={currentSectionID}>
            {props.children}
        </PlayerSectionContext.Provider>
    );
};

export default PlayerSectionProvider;

