import { Grid, Box, Theme } from "@material-ui/core";
import { Paper as UnstyledPaper, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React, { useRef, useState } from "react";
import "swiper/components/navigation/navigation.min.css";
import SwiperCore, { Navigation, Pagination } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import { AllScales } from "../../common/music/scale/Scale";
import ScaleChart, { StartingFret } from "./ScaleChart";
import ScaleSelection, { SelectableScale } from "./ScaleSelection";

// install Swiper modules
SwiperCore.use([Navigation, Pagination]);

const MarginBox = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(2),
    },
}))(Box);

const Paper = withStyles({
    root: {
        display: "block",
    },
})(UnstyledPaper);

interface GuitarDemoProps {}

const GuitarDemo: React.FC<GuitarDemoProps> = (
    props: GuitarDemoProps
): JSX.Element => {
    const [scales, setScales] = useState<SelectableScale[]>([]);
    const [startingFret, setStartingFret] = useState<StartingFret>(5);

    const firstRowSwiperRef = useRef<SwiperCore | null>(null);
    const secondRowSwiperRef = useRef<SwiperCore | null>(null);

    const fretSelector = (
        <TextField
            label="Starting Fret"
            type="number"
            InputLabelProps={{
                shrink: true,
            }}
            variant="outlined"
            value={startingFret}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const val = parseInt(event.target.value);
                if (val <= 0 || val > 21) {
                    return;
                }

                if (val % 1 !== 0) {
                    return;
                }

                setStartingFret(val as StartingFret);
            }}
        />
    );

    const menu = (
        <Grid container>
            <Grid item xs={9}>
                <MarginBox>
                    <ScaleSelection scales={scales} onSelection={setScales} />
                </MarginBox>
            </Grid>
            <Grid item xs={3}>
                <MarginBox>{fretSelector}</MarginBox>
            </Grid>
        </Grid>
    );

    const makeSlide = (scale: SelectableScale): JSX.Element => {
        return (
            <SwiperSlide>
                <ScaleChart
                    scale={AllScales[scale.scaleName][scale.note]}
                    startingFret={startingFret}
                />
            </SwiperSlide>
        );
    };

    const slidesPerView = 4;
    const secondRow = scales.length > slidesPerView;
    const overflow = scales.length > 2 * slidesPerView;

    const firstRowSwiper: JSX.Element = (() => {
        const rotateSecondRow = (swiper: SwiperCore) => {
            if (!overflow) {
                return;
            }

            if (secondRowSwiperRef.current === null) {
                return;
            }

            const secondRowSlideIndex =
                (swiper.realIndex + slidesPerView) % scales.length;
            secondRowSwiperRef.current.slideToLoop(secondRowSlideIndex);
        };

        const firstRowSlides: JSX.Element[] = (() => {
            if (overflow) {
                return scales.map(makeSlide);
            }

            const firstSetScales = scales.slice(0, slidesPerView);
            return firstSetScales.map(makeSlide);
        })();

        return (
            <Swiper
                slidesPerView={slidesPerView}
                slidesPerGroup={slidesPerView}
                navigation={overflow}
                loop={overflow}
                onSlideChange={rotateSecondRow}
                onSwiper={(swiper: SwiperCore) => {
                    firstRowSwiperRef.current = swiper;
                }}
            >
                {firstRowSlides}
            </Swiper>
        );
    })();

    const secondRowSwiper: JSX.Element | null = (() => {
        if (!secondRow) {
            return null;
        }

        const secondRowSlides: JSX.Element[] = (() => {
            if (overflow) {
                return scales.map(makeSlide);
            }

            const secondSetScales = scales.slice(
                slidesPerView,
                2 * slidesPerView
            );
            return secondSetScales.map(makeSlide);
        })();

        return (
            <Swiper
                slidesPerView={slidesPerView}
                loop={overflow}
                onSwiper={(swiper: SwiperCore) => {
                    secondRowSwiperRef.current = swiper;
                }}
                initialSlide={slidesPerView}
            >
                {secondRowSlides}
            </Swiper>
        );
    })();

    return (
        <Paper>
            {menu}
            {firstRowSwiper}
            {secondRowSwiper}
        </Paper>
    );
};

export default GuitarDemo;
