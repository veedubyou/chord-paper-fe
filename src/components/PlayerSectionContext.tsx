import { TimestampedSection } from "common/ChordModel/ChordLine";
import { ChordSong } from "common/ChordModel/ChordSong";
import {
    findSectionAtTime,
    TimestampedSectionItem,
} from "common/ChordModel/Section";
import { PlayerTimeContext } from "components/PlayerTimeContext";
import { List } from "immutable";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";

const sectionCheckInterval = 250;

export const PlayerSectionContext =
    React.createContext<TimestampedSectionItem | null>(null);

interface PlayerSectionProviderProps {
    song: ChordSong;
    children: React.ReactNode;
}

const PlayerSectionProvider: React.FC<PlayerSectionProviderProps> = (
    props: PlayerSectionProviderProps
) => {
    const getPlayerTimeRef = useContext(PlayerTimeContext);
    const sectionsRef = useRef<List<TimestampedSection>>(props.song.timestampedSections);
    const [currentSection, setCurrentSection] =
        useState<TimestampedSectionItem | null>(null);

    const maybeSetNewSection = useCallback(() => {
        const getPlayerTime = getPlayerTimeRef.current;

        const currentTime = getPlayerTime();
        const isBeginningOfSong = currentTime === 0;

        // also avoiding setting an active section for the beginning of the song
        // because it will cause sections to highlight or get labelled when in fact
        // nothing started to play yet
        if (currentTime === null || isBeginningOfSong) {
            if (currentSection !== null) {
                setCurrentSection(null);
            }

            return;
        }

        const timestampedSections = sectionsRef.current;

        const nowTimestampedSection = findSectionAtTime(
            timestampedSections,
            currentTime
        );

        const sectionChanged =
            currentSection?.timestampedSection.lineID !==
            nowTimestampedSection?.timestampedSection.lineID;

        if (!sectionChanged) {
            return;
        }

        setCurrentSection(nowTimestampedSection);
    }, [currentSection, setCurrentSection, getPlayerTimeRef]);

    const sectionsChanged = sectionsRef.current !== props.song.timestampedSections;
    if (sectionsChanged) {
        sectionsRef.current = props.song.timestampedSections;
        maybeSetNewSection();
    }

    useEffect(() => {
        const intervalID = setInterval(
            maybeSetNewSection,
            sectionCheckInterval
        );

        return () => clearInterval(intervalID);
    }, [maybeSetNewSection]);

    return (
        <PlayerSectionContext.Provider value={currentSection}>
            {props.children}
        </PlayerSectionContext.Provider>
    );
};

export default PlayerSectionProvider;
