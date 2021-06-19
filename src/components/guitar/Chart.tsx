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

const RotatedBox = withStyles({
    root: {
        transform: "rotate(270deg) scale(0.5)",
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
            const fretNumber = fretLabel.fret - startingFret + 1;
            if (fretNumber <= 0) {
                throw new Error(
                    "Invalid finger generated - got a negative fretting"
                );
            }

            const labelColour: string | undefined = (() => {
                switch (fretLabel.importance) {
                    case "normal": {
                        return undefined;
                    }

                    case "root": {
                        return "blue";
                    }

                    case "chordtone": {
                        return "red";
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

interface ScaleChartProps {
    scale: Scale;
    startingFret: number;
}

const ScaleChart: React.FC<ScaleChartProps> = (
    props: ScaleChartProps
): JSX.Element => {
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

    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if (ref.current === null) {
            console.log("BAIL");
            return;
        }

        const endingFret = props.startingFret + fretWindow;
        const guitarScaleView = generateGuitarScaleView(
            props.scale,
            props.startingFret,
            endingFret,
            "note"
        );

        const svguitarChord = new SVGuitarChord(ref.current);
        svguitarChord.chord({
            barres: [],
            fingers: convertScaleViewToFingers(guitarScaleView, 7),
            title: new ScaleUtility(props.scale).name(),
        });

        svguitarChord.configure({
            position: props.startingFret,
            fretLabelPosition: FretLabelPosition.LEFT,
        });

        svguitarChord.draw();

        const texts = ref.current.querySelectorAll(".nut-text,.position");
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
        ref: ref,
    };

    return <RotatedBox {...refProps}></RotatedBox>;
};

export default ScaleChart;
