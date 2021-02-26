import { Box, Button, Divider, Slide, Theme } from "@material-ui/core";
import CollapseDownIcon from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/styles";
import React from "react";
import ReactPlayer from "react-player";
import { roundedTopCornersStyle, withBottomRightBox } from "./common";

interface FullSizedPlayerProps {
    show: boolean;
    url: string;
    onCollapse: () => void;
}

const ButtonGroup = withStyles({
    root: {
        marginLeft: "auto",
    },
})(Box);

const TitleBar = withStyles((theme: Theme) => ({
    root: {
        width: "100%",
        display: "flex",
        ...roundedTopCornersStyle(theme),
    },
}))(Box);

const TitleBarButton = withStyles((theme: Theme) => ({
    root: {
        minWidth: 0,
        ...roundedTopCornersStyle(theme),
    },
}))(Button);

const FullPlayerContainer = withStyles((theme: Theme) => ({
    root: {
        backgroundColor: "white",
        ...roundedTopCornersStyle(theme),
    },
}))(Box);

const FullSizedPlayer: React.FC<FullSizedPlayerProps> = (
    props: FullSizedPlayerProps
): JSX.Element => {
    return (
        <Slide in={props.show} direction="up">
            {withBottomRightBox(
                <FullPlayerContainer>
                    <TitleBar>
                        <ButtonGroup>
                            <TitleBarButton onClick={props.onCollapse}>
                                <CollapseDownIcon />
                            </TitleBarButton>
                        </ButtonGroup>
                    </TitleBar>
                    <Divider />
                    <Box>
                        <ReactPlayer url={props.url} controls height="10vh" />
                    </Box>
                </FullPlayerContainer>
            )}
        </Slide>
    );
};

export default FullSizedPlayer;
