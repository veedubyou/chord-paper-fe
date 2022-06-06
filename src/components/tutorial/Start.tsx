import { Typography } from "@mui/material";
import { LineBreak } from "components/tutorial/Common";
import { convertToTutorialComponent } from "components/tutorial/TutorialComponent";
import React from "react";

const title = "Learn Chord Paper";

const Header = () => {
    return <Typography variant="h5">{title}</Typography>;
};

const Preamble = () => {
    return (
        <>
            <Typography>
                Chord Paper aims to be as intuitive and handy as possible, but
                there could still be features that aren't obvious as we work out
                the kinks. Let's walk through the basics together by making some
                changes to chords and lyrics!
            </Typography>
            <LineBreak />
            <Typography>
                Since Chord Paper is still in early stages, some of these could
                change in the future.
            </Typography>
        </>
    );
};

const Starting: React.FC<{}> = (): JSX.Element => {
    return (
        <>
            <Header />
            <LineBreak />
            <Preamble />
        </>
    );
};

export default convertToTutorialComponent(Starting, title);
