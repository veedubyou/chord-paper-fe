import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React, { useEffect, useRef } from "react";
import { Finger, FretLabelPosition, Shape, SVGuitarChord } from "svguitar";
import { StringName } from "../../common/music/guitar/Fretboard";
import {
    generateGuitarScaleView,
    GuitarFretLabel,
} from "../../common/music/guitar/Scale";
import { Scale, ScaleUtility } from "../../common/music/scale/Scale";

const ChartBox = withStyles({
    root: {
        transform: "rotate(270deg)",

        "& svg": {
            // magic number, but it makes charts not overlap
            transform: "scale(0.85)",
        },
        "& .title": {
            fontFamily: "PoriChord",
        },
    },
})(Box);

const fretWindow = 4;

const stringNameMap: Record<StringName, number> = {
    highE: 1,
    B: 2,
    G: 3,
    D: 4,
    A: 5,
    E: 6,
};

const convertScaleViewToFingers = (
    scaleView: Record<StringName, GuitarFretLabel[]>,
    startingFret: number
): Finger[] => {
    const fingers: Finger[] = [];

    let stringName: StringName;
    for (stringName in scaleView) {
        const stringNumber = stringNameMap[stringName];

        const fretLabels = scaleView[stringName];
        for (const fretLabel of fretLabels) {
            let fretNumber: number = (() => {
                const fretNumber = fretLabel.fret - startingFret + 1;
                if (fretNumber <= 0) {
                    throw new Error(
                        "Invalid finger generated - got a zero or negative fretting"
                    );
                }

                return fretNumber;
            })();

            const labelColour: string | undefined = (() => {
                switch (fretLabel.importance) {
                    case "normal": {
                        return "black";
                    }

                    case "root": {
                        return "#f44336";
                    }

                    case "chordtone": {
                        return "#64b5f6";
                    }

                    case "special": {
                        return "purple";
                    }
                }
            })();

            const shape: Shape =
                fretLabel.importance === "root" ? Shape.SQUARE : Shape.CIRCLE;

            fingers.push([
                stringNumber,
                fretNumber,
                {
                    text: fretLabel.labelText,
                    color: labelColour,
                    shape: shape,
                },
            ]);
        }
    }

    return fingers;
};

export type StartingFret =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21;

interface ScaleChartProps {
    scale: Scale;
    startingFret: StartingFret;
}

const ScaleChart: React.FC<ScaleChartProps> = (
    props: ScaleChartProps
): JSX.Element => {
    const elemRef = useRef<HTMLElement>(null);
    const prevSVGuitarChord = useRef<SVGuitarChord | null>(null);

    const getPos = (elem: SVGTextElement): [number, number] | undefined => {
        if (
            elem.x.baseVal.numberOfItems === 0 ||
            elem.y.baseVal.numberOfItems === 0
        ) {
            return undefined;
        }

        return [
            elem.x.baseVal.getItem(0).value,
            elem.y.baseVal.getItem(0).value,
        ];
    };

    useEffect(() => {
        if (elemRef.current === null) {
            return;
        }

        if (prevSVGuitarChord.current !== null) {
            prevSVGuitarChord.current.remove();
        }

        const endingFret = props.startingFret + fretWindow;
        const guitarScaleView = generateGuitarScaleView(
            props.scale,
            props.startingFret,
            endingFret,
            "note"
        );

        const svguitarChord = new SVGuitarChord(elemRef.current);
        svguitarChord.chord({
            barres: [],
            fingers: convertScaleViewToFingers(
                guitarScaleView,
                props.startingFret
            ),
            title: new ScaleUtility(props.scale).name(),
        });

        svguitarChord.configure({
            position: props.startingFret,
            fretLabelPosition: FretLabelPosition.LEFT,
        });

        svguitarChord.draw();
        prevSVGuitarChord.current = svguitarChord;

        const texts = elemRef.current.querySelectorAll(".nut-text,.position");
        texts.forEach((elem: Element) => {
            if (!(elem instanceof SVGTextElement)) {
                return;
            }

            const pos = getPos(elem);
            if (pos === undefined) {
                return;
            }

            setTimeout(() =>
                elem.setAttribute("transform", `rotate(90,${pos[0]},${pos[1]})`)
            );
        });
    }, [props.scale, props.startingFret]);

    // https://github.com/mui-org/material-ui/issues/17010
    const refProps = {
        ref: elemRef,
    };

    return <ChartBox {...refProps}></ChartBox>;
};

export default ScaleChart;
