import {
    Box,
    Grid,
    TextField,
    Theme,
    Tooltip as UnstyledTooltip,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { Scale, ScaleUtility } from "../../common/music/scale/Scale";
import FretSelector from "./FretSelector";
import ScaleChart, { StartingFret } from "./ScaleChart";

const Tooltip = withStyles((theme: Theme) => ({
    tooltip: {
        background: "white",
        boxShadow: theme.shadows[2],
    },
}))(UnstyledTooltip);

const MarginBox = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(2),
    },
}))(Box);

interface MenuSelectableScaleChartProps {
    scale: Scale;
    initialStartingFret: StartingFret;
}

const MenuSelectableScaleChart: React.FC<MenuSelectableScaleChartProps> = (
    props: MenuSelectableScaleChartProps
): JSX.Element => {
    const [label, setLabel] = useState(new ScaleUtility(props.scale).name());
    const [startingFret, setStartingFret] = useState(props.initialStartingFret);

    const menu = (
        <Grid container>
            <Grid item xs={6}>
                <MarginBox>
                    <FretSelector
                        startingFret={startingFret}
                        onStartingFretChanged={setStartingFret}
                    />
                </MarginBox>
            </Grid>
            <Grid item xs={6}>
                <MarginBox>
                    <TextField
                        label="Label"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        value={label}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                            setLabel(event.target.value);
                        }}
                    />
                </MarginBox>
            </Grid>
        </Grid>
    );

    return (
        <Tooltip placement="top" interactive title={menu}>
            <span>
                <ScaleChart
                    scale={props.scale}
                    scaleLabel={label}
                    startingFret={startingFret}
                />
            </span>
        </Tooltip>
    );
};

export default MenuSelectableScaleChart;
