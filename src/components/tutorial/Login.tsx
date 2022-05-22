import { Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import React from "react";
import { Link } from "react-router-dom";
import { getRouteForTutorialComponent } from "../Tutorial";
import { LineBreak } from "./Common";
import TrackPlayer from "./TrackPlayer";
import { convertToTutorialComponent } from "./TutorialComponent";

const title = "Logging In";

const Login: React.FC<{}> = (): JSX.Element => {
    const trackPlayerRoute = getRouteForTutorialComponent(TrackPlayer);

    return (
        <>
            <Typography variant="h5">{title}</Typography>
            <LineBreak />
            <Typography>
                You can save and load your songs if you have logged in. When you
                want to save your song to the cloud, hover to the bottom right
                menu and click <CloudUploadIcon /> to commit the song. After the
                song is saved once, it will continue to save any changes
                automatically.
            </Typography>
            <LineBreak />
            <Typography>
                Having an account also means you can add music tracks to the{" "}
                <Link to={trackPlayerRoute}>Track Player</Link>.
            </Typography>
            <LineBreak />
            <Typography>
                Accounts are provided on an invite basis right now. Requests for
                invites coming soon.
            </Typography>
            <LineBreak />
            <Typography>
                If you don't want to sign in or save your songs to the cloud, I
                get it. You can also reveal (offline) Save and Load menu icons
                in the bottom right menu by entering the{" "}
                <a href="https://en.wikipedia.org/wiki/Konami_Code">
                    Konami Code
                </a>{" "}
                to save and load the files striaght to your computer.
            </Typography>
        </>
    );
};

export default convertToTutorialComponent(Login, title);
