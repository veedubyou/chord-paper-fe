import { TimeSection } from "../../../common/ChordModel/ChordLine";

export const useSections = (
    timeSections: TimeSection[],
    currentTime: number
): [TimeSection | null, TimeSection | null, TimeSection | null, string] => {
    const [currentSection, previousSection, nextSection] = ((): [
        TimeSection | null,
        TimeSection | null,
        TimeSection | null
    ] => {
        let currentSectionIndex: number | null = null;

        timeSections.forEach((section: TimeSection, index: number) => {
            if (currentTime >= section.time) {
                if (
                    currentSectionIndex === null ||
                    section.time > timeSections[currentSectionIndex].time
                ) {
                    currentSectionIndex = index;
                }
            }
        });

        const currentSection = (() => {
            if (currentSectionIndex === null) {
                return null;
            }
            return timeSections[currentSectionIndex];
        })();

        const previousSection = (() => {
            if (currentSectionIndex === null || currentSectionIndex === 0) {
                return null;
            }

            return timeSections[currentSectionIndex - 1];
        })();

        const nextSection = (() => {
            if (timeSections.length === 0) {
                return null;
            }

            if (currentSectionIndex === null) {
                return timeSections[0];
            }

            if (currentSectionIndex === timeSections.length - 1) {
                return null;
            }

            return timeSections[currentSectionIndex + 1];
        })();

        return [currentSection, previousSection, nextSection];
    })();

    const currentSectionLabel =
        currentSection !== null ? currentSection.name : "";

    return [currentSection, previousSection, nextSection, currentSectionLabel];
};
