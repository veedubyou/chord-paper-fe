import {
    Box,
    Grid,
    styled,
    TextField,
    Theme
} from "@mui/material";
import { Scale, ScaleUtility } from "common/music/scale/Scale";
import { makeStyledTooltipMenu } from "components/edit/StyledTooltip";
import FretSelector from "components/guitar/FretSelector";
import ScaleChart, { StartingFret } from "components/guitar/ScaleChart";
import React, { useState } from "react";

const Tooltip = makeStyledTooltipMenu((theme: Theme) => ({
    background: "white",
    boxShadow: theme.shadows[2],
}));

const MarginBox = styled(Box)(({ theme }) => ({
    margin: theme.spacing(2),
}));

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
        <Tooltip placement="top" title={menu}>
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
