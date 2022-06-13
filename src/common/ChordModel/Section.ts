import { TimestampedSection } from "common/ChordModel/ChordLine";
import { List } from "immutable";

export interface TimestampedSectionItem {
    index: number;
    timestampedSection: TimestampedSection;
}

export const findSectionAtTime = (
    timestampedSections: List<TimestampedSection>,
    currentTime: number
): TimestampedSectionItem | null => {
    if (timestampedSections.size === 0) {
        return null;
    }

    let sectionItemAtCurrentTime: TimestampedSectionItem | null = null;

    timestampedSections.forEach(
        (candidateSection: TimestampedSection, index: number) => {
            if (currentTime < candidateSection.time) {
                return;
            }

            if (
                sectionItemAtCurrentTime !== null &&
                candidateSection.time <=
                    sectionItemAtCurrentTime.timestampedSection.time
            ) {
                return;
            }

            sectionItemAtCurrentTime = {
                index: index,
                timestampedSection: candidateSection,
            };
        }
    );

    return sectionItemAtCurrentTime;
};

