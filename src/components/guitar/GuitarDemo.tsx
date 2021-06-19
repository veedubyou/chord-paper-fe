import React from "react";
import { AllScales } from "../../common/music/scale/Scale";
import ScaleChart from "./Chart";

interface GuitarDemoProps {}

const GuitarDemo: React.FC<GuitarDemoProps> = (
    props: GuitarDemoProps
): JSX.Element => {
    return (
        <>
            <ScaleChart scale={AllScales["Dorian"]["C"]} startingFret={7} />
            <ScaleChart scale={AllScales["Dominant"]["G"]} startingFret={7} />;
        </>
    );
};

export default GuitarDemo;
