import { Either, isLeft } from "fp-ts/lib/Either";
import React from "react";
import NeverGonnaGiveYouPlasticLove from "../assets/songs/never_gonna_give_you_up_plastic_love.json";
import { ChordSong } from "../common/ChordModel/ChordSong";
import ErrorPage from "./display/ErrorPage";
import { demoPath } from "../common/paths";
import SongRouter from "./SongRouter";
import { withSongContext } from "./WithSongContext";

const DemoSong = withSongContext(SongRouter);

const Demo: React.FC<{}> = (): JSX.Element => {
    const loadSongResults: Either<Error, ChordSong> = ChordSong.fromJSONObject(
        NeverGonnaGiveYouPlasticLove
    );

    if (isLeft(loadSongResults)) {
        return <ErrorPage />;
    }

    const song = loadSongResults.right;

    return <DemoSong path={demoPath} song={song} />;
};

export default Demo;
