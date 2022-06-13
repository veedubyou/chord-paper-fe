import { ChordLine } from "common/ChordModel/ChordLine";
import LineWithSectionHighlight from "components/display/LineWithSectionHighlight";
import { List } from "immutable";
import React from "react";

export interface SectionHighlightProps {
    sectionLines: List<ChordLine>;
    lineElementFn: (
        line: ChordLine
    ) => React.ReactElement | React.ReactElement[];
}

const SectionHighlight: React.FC<SectionHighlightProps> = (
    props: SectionHighlightProps
): JSX.Element => {
    const sectionID = props.sectionLines.get(0)?.id;
    if (sectionID === undefined) {
        throw new Error("Sections are expected to have at least one line");
    }

    const makeLineElement = (line: ChordLine, index: number) => {
        const isTop = index === 0;
        const isBottom = index === props.sectionLines.size - 1;
        return (
            <LineWithSectionHighlight
                key={line.id}
                sectionID={sectionID}
                top={isTop}
                bottom={isBottom}
            >
                {props.lineElementFn(line)}
            </LineWithSectionHighlight>
        );
    };

    const lines = props.sectionLines.map(makeLineElement);

    return <>{lines}</>;
};

export default SectionHighlight;

