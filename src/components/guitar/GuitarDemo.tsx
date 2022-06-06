import { Box, Grid, Paper as UnstyledPaper, styled } from "@mui/material";
import { AllScales, ScaleUtility } from "common/music/scale/Scale";
import FretSelector from "components/guitar/FretSelector";
import MenuSelectableScaleChart from "components/guitar/MenuSelectableScaleChart";
import { StartingFret } from "components/guitar/ScaleChart";
import ScaleSelection, { SelectableScale } from "components/guitar/ScaleSelection";
import React, { useRef, useState } from "react";
import "swiper/components/navigation/navigation.min.css";
import SwiperCore, { Navigation, Pagination } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";

// install Swiper modules
SwiperCore.use([Navigation, Pagination]);

const MarginBox = styled(Box)(({ theme }) => ({
    margin: theme.spacing(2),
}));

const Paper = styled(UnstyledPaper)({
    display: "block",
});

interface GuitarDemoProps {}

const GuitarDemo: React.FC<GuitarDemoProps> = (
    props: GuitarDemoProps
): JSX.Element => {
    const [scales, setScales] = useState<SelectableScale[]>([]);
    const [startingFret, setStartingFret] = useState<StartingFret>(5);

    const firstRowSwiperRef = useRef<SwiperCore | null>(null);
    const secondRowSwiperRef = useRef<SwiperCore | null>(null);

    const menu = (
        <Grid container>
            <Grid item xs={9}>
                <MarginBox>
                    <ScaleSelection scales={scales} onSelection={setScales} />
                </MarginBox>
            </Grid>
            <Grid item xs={3}>
                <MarginBox>
                    <FretSelector
                        startingFret={startingFret}
                        onStartingFretChanged={setStartingFret}
                    />
                </MarginBox>
            </Grid>
        </Grid>
    );

    const makeSlide = (selectableScale: SelectableScale): JSX.Element => {
        const scale =
            AllScales[selectableScale.scaleName][selectableScale.note];
        return (
            <SwiperSlide>
                <MenuSelectableScaleChart
                    key={new ScaleUtility(scale).name()}
                    scale={scale}
                    initialStartingFret={startingFret}
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
